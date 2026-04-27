import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { ChatGroq } from '@langchain/groq';
import fs from 'fs-extra';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.warn('WARNING: GROQ_API_KEY is missing. LLM features will fail until configured.');
  }
  
  // Use ChatGroq with Llama 3
  const llm = new ChatGroq({
    apiKey: groqApiKey || 'MISSING_KEY',
    model: 'llama-3.3-70b-versatile',
  });

  // API Routes
  
  // 1. Doubt Solver (RAG)
  app.post('/api/solve-doubt', async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) return res.status(400).json({ error: 'Question is required' });

      console.log(`Processing doubt: "${question}"`);

      // Simulate RAG by reading context from files
      const dataDir = path.join(process.cwd(), 'data');
      const dsaPath = path.join(dataDir, 'dsa_notes.txt');
      const sqlPath = path.join(dataDir, 'sql_os_notes.txt');
      
      const dsaNotesExists = await fs.pathExists(dsaPath);
      const sqlNotesExists = await fs.pathExists(sqlPath);
      
      let context = '';
      if (dsaNotesExists) {
        context += await fs.readFile(dsaPath, 'utf-8');
        console.log('DSA context loaded');
      }
      if (sqlNotesExists) {
        context += '\n' + await fs.readFile(sqlPath, 'utf-8');
        console.log('SQL/OS context loaded');
      }

      const prompt = `
        You are a Placement Preparation Expert. 
        Use the following study materials as context to help the student with their doubt.
        If the answer is not in the context, use your general knowledge but mention that it's based on general concepts.
        Provide a clear, pedagogical, and concise explanation. Use code examples where relevant.
        
        CONTEXT:
        ${context || 'No specific context available.'}
        
        STUDENT DOUBT: ${question}
      `;

      const result = await llm.invoke(prompt);
      console.log('LLM response generated successfully');
      res.json({ answer: result.content });
    } catch (error: any) {
      console.error('Doubt solver error:', error);
      res.status(500).json({ 
        error: 'Backend LLM failure', 
        details: error.message,
        suggestion: 'Check if GROQ_API_KEY is correctly set in the Secrets panel.'
      });
    }
  });

  // 2. Quiz Generator
  app.post('/api/generate-quiz', async (req, res) => {
    try {
      const { topic, difficulty, count = 5 } = req.body;

      const prompt = `
        Generate ${count} interview questions about "${topic}" for "${difficulty}" level.
        Return the response strictly as a JSON array of objects. Each object MUST have:
        - "question": string
        - "options": string[] (exactly 4 options)
        - "answer": string (must be one of the four options provided)
        - "explanation": string
        
        ONLY return the JSON. No markdown backticks.
      `;

      const result = await llm.invoke(prompt);
      const text = String(result.content).replace(/```json|```/g, '').trim();
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Quiz generator error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Study Material Generator
  app.post('/api/study-material', async (req, res) => {
    try {
      const { topic } = req.body;

      const prompt = `
        Generate an extremely detailed and comprehensive structured study guide for "${topic}".
        The guide must be thorough and include:
        
        1. **Deep Dive Key Concepts**: Explain the fundamental principles, architecture, and core components in detail.
        2. **Technical Nuances & Edge Cases**: Discuss complex scenarios, performance trade-offs, and optimization strategies.
        3. **Important Theoretical Points**: Cover historical context (if relevant) and theoretical foundations.
        4. **Detailed Implementation/Code Guides**: Provide robust code examples or step-by-step algorithms where applicable.
        5. **Extensive Interview Question Bank**: List at least 5-7 high-frequency interview questions with detailed ideal answers.
        6. **Strategic Preparation Roadmap**: Specific tips on what to focus on for top-tier companies.
        
        Use Markdown formatting with clear headings, sub-headings, tables (if useful), and blockquotes for emphasis.
        Ensure high intellectual density and clarity.
      `;

      const result = await llm.invoke(prompt);
      res.json({ content: result.content });
    } catch (error: any) {
      console.error('Study material error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

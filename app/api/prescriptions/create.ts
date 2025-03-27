import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { patientId, medication, dosage } = req.body;
      await sql`
        INSERT INTO prescriptions (patient_id, medication, dosage)
        VALUES (${patientId}, ${medication}, ${dosage})
      `;
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear receta' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
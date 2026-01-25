import type { Request, Response } from "express";

export function createRFQ(_req: Request, res: Response): void {
  res.status(201).json({ message: "Create RFQ placeholder" });
}

export function getRFQs(_req: Request, res: Response): void {
  res.json({ rfqs: [] });
}

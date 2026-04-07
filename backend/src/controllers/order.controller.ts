import type { Request, Response } from "express";

export function createOrder(_req: Request, res: Response): void {
  res.status(201).json({ message: "Create order placeholder" });
}

export function getOrders(_req: Request, res: Response): void {
  res.json({ orders: [] });
}

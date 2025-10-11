-- Delete specific checkpoints
DELETE FROM checkpoints WHERE id IN (8, 9, 10);

-- Delete Monterrey sector
DELETE FROM sectors WHERE id = 12;
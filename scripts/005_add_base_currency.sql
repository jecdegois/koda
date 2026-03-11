-- Add base_currency_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS base_currency_id UUID REFERENCES public.monedas(id) ON DELETE SET NULL;

-- Add is_base to monedas table to indicate if it's the user's base currency
ALTER TABLE public.monedas
ADD COLUMN IF NOT EXISTS is_base BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_monedas_is_base ON public.monedas(user_id, is_base);

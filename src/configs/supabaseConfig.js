import { createClient } from "@supabase/supabase-js";

let options = {
  schema: ["auth", "belajar", "user"],
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, options);

export default supabase;

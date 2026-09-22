import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhtjnfeohafpnwcacssk.supabase.co';
const supabaseAnonKey = 'sb_publishable_Js69Lv_DD1bhV1Q_wCXJIA_ON1c_vTr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

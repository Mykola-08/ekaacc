
import json
import re

def main():
    with open('c:/ekaacc/advisors.json', 'r') as f:
        data = json.load(f)
    
    lints = data.get('lints', [])
    sql_lines = ["-- Drop unused indexes to resolve performance advisors", "DO $$", "BEGIN"]
    
    for lint in lints:
        if lint['name'] == 'unused_index':
            # Detail format: Index `name` on table `schema.table` has not been used
            detail = lint['detail']
            match = re.search(r"Index `([^`]+)` on table `([^`]+)`", detail)
            if match:
                index_name = match.group(1)
                full_table_name = match.group(2)
                # Parse schema and table if needed, but for DROP INDEX we just need schema.index usually?
                # Actually indexes are unique per schema.
                # full_table_name might be "public.table" or "stripe.table"
                
                # To be safe: DROP INDEX IF EXISTS schema.index_name
                # We need to extract schema from full_table_name
                if '.' in full_table_name:
                    schema = full_table_name.split('.')[0]
                else:
                    schema = "public"
                
                sql_lines.append(f'  DROP INDEX IF EXISTS "{schema}"."{index_name}";')

    sql_lines.append("END $$;")
    
    with open('c:/ekaacc/supabase/migrations/20260117000003_drop_unused_indexes.sql', 'w') as f:
        f.write('\n'.join(sql_lines))

if __name__ == "__main__":
    main()

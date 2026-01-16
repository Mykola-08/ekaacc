
import json

def main():
    try:
        with open('c:/ekaacc/missing_indexes.json', 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading json: {e}")
        return

    sql_lines = ["-- Add missing indexes for foreign keys", "DO $$", "BEGIN"]
    
    for item in data:
        # Each item is {"create_sqls": "..."}
        # The string already ends with ;.
        # We need to execute it.
        # But wait, CREATE INDEX CONCURRENTLY cannot run inside a transaction/DO block.
        # We should use standard CREATE INDEX.
        # Check if CONCURRENTLY is in string.
        sql = item['create_sqls']
        if "CONCURRENTLY" in sql:
            sql = sql.replace("CONCURRENTLY ", "")
        
        # Add to block
        sql_lines.append(f"  {sql}")

    sql_lines.append("END $$;")
    
    with open('c:/ekaacc/supabase/migrations/20260117000004_add_missing_fk_indexes.sql', 'w') as f:
        f.write('\n'.join(sql_lines))

if __name__ == "__main__":
    main()

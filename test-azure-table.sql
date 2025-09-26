-- Quick test to check if blood_stock table exists in Azure PostgreSQL
-- Run this in your Azure PostgreSQL connection

\echo 'Checking if blood_stock table exists in Azure PostgreSQL...'
\echo '==========================================================='

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'blood_stock'
);

-- If table exists, show its structure
\d blood_stock

-- If table exists, show sample data
SELECT COUNT(*) as total_records FROM blood_stock;

-- Show all tables to see what exists
\echo 'All tables in the database:'
\dt

\echo 'If blood_stock table does not exist, that is the problem!'
\echo 'Run the full azure-blood-stock-setup.sql script to create it.'
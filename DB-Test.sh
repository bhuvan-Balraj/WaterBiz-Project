BASE_URL=http://localhost:3000/api/customers

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "primary_mobile": "9876543210",
    "secondary_mobile": "9988776655",
    "address": "45 Gandhi Street, Chennai",
    "map_location": "https://maps.google.com/?q=13.0827,80.2707"
  }'


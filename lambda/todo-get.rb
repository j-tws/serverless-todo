require 'json'
require 'aws-sdk-dynamodb'

def lambda_handler(event:, context:)
  db = Aws::DynamoDB::Client.new
  todo_table = db.list_tables[:table_names][0]

  resp = db.scan({
                   table_name: todo_table,
                   select: 'ALL_ATTRIBUTES'
                 })

  {
    statusCode: 200,
    body: resp['items'].to_json,
    headers: {
      'Access-Control-Allow-Headers' => 'Content-Type',
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'OPTIONS,POST,GET'
    }
  }
end

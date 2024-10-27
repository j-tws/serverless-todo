require 'json'
require 'aws-sdk-dynamodb'

def lambda_handler(event:, context:)
  cors_headers = {
    'Access-Control-Allow-Headers' => 'Content-Type',
    'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Methods' => 'OPTIONS,POST,GET'
  }

  db = Aws::DynamoDB::Client.new
  todo_table = db.list_tables[:table_names][0]

  todo_to_add = JSON.parse(event['body'])['name']

  # check if db already have todo with the same name as todo_to_add
  query_resp = db.query({
                          table_name: todo_table,
                          key_condition_expression: '#name = :name',
                          expression_attribute_names: { '#name' => 'name' },
                          expression_attribute_values: { ':name' => todo_to_add }
                        })

  if query_resp['items'].length != 0
    return {
      statusCode: 422,
      body: {
        message: "Todo with '#{todo_to_add}' already exists"
      }.to_json,
      headers: cors_headers
    }
  end

  db.put_item({
                item: {
                  'name' => todo_to_add,
                  'created_at' => Time.now.strftime('%Y-%m-%dT%H:%M:%S.%L%z')
                },
                table_name: todo_table
              })

  {
    statusCode: 200,
    body: {}.to_json,
    headers: cors_headers
  }
rescue Aws::DynamoDB::Errors::ServiceError => e
  {
    statusCode: 500,
    body: {
      message: e.message
    }.to_json,
    headers: cors_headers
  }
end

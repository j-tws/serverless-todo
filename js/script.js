const getTodos = async () => {
  const url = "https://m79mw2o937.execute-api.ap-southeast-2.amazonaws.com/prod"

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    });

    if (!response.ok ){
      throw new Error(`Error fetching content: ${response}`)
    }

    return response.json()
  } catch(e) {
    console.error(e.message)
  }
}

const postTodos = async (payload) => {
  const url = "https://m79mw2o937.execute-api.ap-southeast-2.amazonaws.com/prod"

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    })

    if (!response.ok && response.status == 422){
      if (response.status == 422){
        const errorNode = document.getElementById("error-message")
        errorNode.innerText = "Todo already exist. Please create another todo."
        throw new Error('Todo already exist')
      } else {
        throw new Error(`Error fetching content: ${response}`)
      }
    }

    return response.json()
  } catch(e) {
    throw new Error(e.message)
  }
}

const todoForm = document.getElementById("todo-form")

const submitHandler = (event) => {
  event.preventDefault()
  const formData = new FormData(todoForm)

  const payload = Object.fromEntries(formData.entries())
  postTodos(payload)
    .then(data => {
      const todoList = document.getElementById("todo-list")
      const newLi = document.createElement("li")
      newLi.innerText = payload.name

      todoList.prepend(newLi)

      const errorNode = document.getElementById("error-message")
      errorNode.innerText = ""
    })
    .catch(error => console.error(error))
}

todoForm.addEventListener("submit", submitHandler)

getTodos()
  .then(data => {
    const todos = data.sort((currTodo, nextTodo) => {
      return Date.parse(nextTodo.created_at) - Date.parse(currTodo.created_at)
    }).map(todo => {
      const newLi = document.createElement("li")
      newLi.innerText = todo["name"]
      return newLi
    })
    
    const todoList = document.getElementById("todo-list")
    todos.forEach(todo => todoList.appendChild(todo))
  })
  .catch(error => {
    console.error(error)
  })
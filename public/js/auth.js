let input = document.getElementById("password")
let submit = document.getElementById("submit")
let msg = document.getElementById("message")

submit.addEventListener('click', e =>{
    axios.get('/auth_result?password='+input.value)
    .then(response =>{
        console.log(response.data)
        if(response.data.token != null){
            // Save tokenised passoword recieved from server into localStorage.
            window.localStorage.setItem('token',response.data.token)
            window.location = "/admin"
        }
        else{
            msg.innerHTML = response.data.err
        }
    })
    
})



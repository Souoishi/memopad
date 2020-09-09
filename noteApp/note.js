//entry fromat
var title, body, newNote, ID;
var editedObj = false;


// constructor to enter new note
var Note = function (id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
};



// reload the note display when new note is saved
reloadRecords =()=> {
    var obj, retitle, rebody;
    for (i=0; i < localStorage.length; i++ ) {
        obj = JSON.parse(localStorage.getItem(i))
        retitle = obj.title 
        rebody = obj.body
        $('#noteRecords').append(`<option id=${i}>${retitle}</option>`)
    }
}

// clear all elem in lower half part
clearReadField =()=> {
    $('option').remove()
    $('#noteDisplay').empty()
}

// clear all elem in higher half part
clearWriteField =()=> {
    $('#title').val('')
    $('#noteBody').val('')
}


// initialize 
function init () {
    clearReadField()

    if (localStorage !== null) {
        var keys = keyExtractor()
        //var arrOfKeys = Object.keys(localStorage);
        var ID;
        for (i=0; i < localStorage.length; i++ ) {
            ID = keys[i]
            obj = JSON.parse(localStorage.getItem(ID))
            retitle = obj.title 
            rebody = obj.body
            //$('#noteRecords').append('test')
            $('#noteRecords').append( `<option id=${ID}>${retitle} </option>`)                 
        }
    }
    $('#noteDisplay').hide()
    
}

//When save button clicked:
    //1. screen change (hide textpad => show the note lists)
    
$('#save_btn').on("click", function(){
    var keys, largestKey;
    

    $('#write').hide()
    $('#read').show()
    console.log(localStorage.length + 'local how')
// * on Write side: get input -> create ID - > set in constructor -> Jsonify -> store in local strge

    //2. get the value of (1) title (2) content
    title = $('#title').val();
    body = $('#noteBody').val();  

    // check if it is already entered and has id num 
    if (editedObj){

        ID = editedObj.id
        newNote = new Note(ID, title, body)
        editedObj = false

    } else if (localStorage.length) {
        // 3. generate Id      
        //get all keys into array
        keys = keyExtractor() 
        //Math.max() to it 
        largestKey = keys[0];
        
        for (i=0; i < keys.length; i++){
            if (isNaN(keys[i])) { 

                continue; 

            } else if (keys[i] > largestKey) {
                largestKey = keys[i];
            }
        } 

        console.log(largestKey + ':largest key')
        //the lagest + 1 => ID
        ID = parseInt(largestKey) + 1
        newNote = new Note(ID, title, body)

    } else {

        console.log('test is it null?')
        ID = 0
        newNote = new Note(ID, title, body)
    
    }

    
    
    // 4. transfor it as a Json file
    noteText = JSON.stringify(newNote)


    // get ID
    //ID = lastItem.id + 1
    // レングスじゃなくて一番大きいID＋１

    // 5. Push it into our local storage
    localStorage.setItem(ID, noteText)
    
    
    alert ("Saveしました");
    
    $('#write').fadeOut(1000)
    init()
    clearWriteField()
   
})

var obj, retitle, rebody;
// keep 

// extract only ids from the all items in local strage
keyExtractor =()=>{
    var arr = [];
    for(i = 0; i < localStorage.length; i++ ){
        arr.push(localStorage.key(i))
    }
    arr.sort(function(a, b){return a-b})
    console.log(arr)
    return arr
} 






// Edit or Delete options on the existed notes
    // it gets on only if the cliked elem = one of options, let go of other clicks 
document.addEventListener('click', function (event) {
    if (event.target.matches('option')){
        $('#noteDisplay').empty()
        var selectedNote, name, content, dispTarget;

        //extract id of the note
        dispTarget = event.target.id;
        // get the Json obj of it from strage
        selectedNote = JSON.parse(localStorage.getItem(dispTarget))
        // extract title && body 
       
        name = selectedNote.title 
        content = selectedNote.body
        //insert them as <h2> and <p> elem under display
        $('#noteDisplay').show()
        $('#noteDisplay').append(`<h2 style="margin: 1rem">${name}</h2>`)
        $('#noteDisplay').append(`<p style="margin: 1rem">${content}</p>`)
        // adding (1) edit (2) delete buttons 
        $('#noteDisplay').append(`<div class='buttons' style='display:flex'></p>`)
        $('.buttons').append(`<button type="button" id='delete_btn' style="margin: 1rem" class="btn btn-outline-primary btn-lg">Delete Note</button>`)
        $('.buttons').append(`<button type="button" id='edit_btn' style="margin: 1rem" class="btn btn-outline-primary btn-lg">Edit Note</button>`)

        $('#delete_btn').on("click", function(){
            //getID of this item
            localStorage.removeItem(dispTarget)
            $('#noteDisplay').hide()
            init()
            //remove from localstrage
            //localStorage.removeItem()
            //init function and reflesh the inside of noteRecods
        })
        $('#edit_btn').on("click", function(){
            //getID of this item
            editedObj = JSON.parse(localStorage.getItem(dispTarget))
            console.log(editedObj + ':obj')
            $('#title').val(editedObj.title)
            $('#noteBody').val(editedObj.body)
            $('#noteDisplay').empty()
            $('#read').hide()
            $('#write').show()

            //remove from localstrage
            //localStorage.removeItem()
            //init function and reflesh the inside of noteRecods
        })
    }
})

// change note lists -> textpad
$('#new_btn').on("click", function(){

    $('#write').show()
    $('#read').hide()
})

init()


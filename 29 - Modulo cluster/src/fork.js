let sum = 0;

process.on('message', cant => {    
    
    let num = parseInt(Object.values(cant))
    if(!num){
        num = 10000000
    }
    console.log(num);
    let obj = randomNum(num)

    process.send(obj);
});

function randomNum(num){
    let numArr = []

    while(num > 0){
        let int = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
        numArr.push(int);
        num--;
    }

    numArr = numArr.sort(function(a, b){return a - b})    
    let numAnt = 0;
    randObj = [];
    numArr.map( num => {                                      
                if(numAnt == num){                    
                    for(let e of randObj){
                        if(e.numero == num){
                            e.cantidad++;
                            console.log(e.numero+" "+ e.cantidad++)
                        }
                    }
                                       
                }else{
                 let obj = {numero: num, cantidad: 1};
                 randObj.push(obj);
                 numAnt = num;
                }
             
            
              
    })
    
  return randObj;
}
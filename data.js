console.log('connected');

// important key 
const apikey="33d0ae79aadc800a9e6eb960dbf19ed8"       // weather and pollution api key 
let cityDetail={
    latitude:'',
    longitude:''
}

let city=document.querySelector('#city');
let temperature=document.querySelector('#temperature');
let cityname=document.querySelector('#cityname');
let temp_min=document.querySelector('#temp_min')
let temp_max=document.querySelector('#temp_max')
let feels_like=document.querySelector('#feel_like')
let humidity=document.querySelector('#humidity')
let airQualityContainer=document.getElementById('airQualityBox')

city.addEventListener('keyup',()=>{
    fetchTemp('cityname');
})

// fetch temperature 
function fetchTemp(callerDetail){
    let url;

    if(callerDetail=='Position')
    {
        url ='https://api.openweathermap.org/data/2.5/weather?lat='+cityDetail.latitude+'&lon='+cityDetail.longitude+'&appid='+apikey;
    }else{
        url ='https://api.openweathermap.org/data/2.5/weather?q='+ city.value +'&appid='+apikey;
    }
    const xhr= new XMLHttpRequest();
    xhr.open('GET',url,true);

    xhr.onload=()=>{
        if(xhr.status==200){
            
            let obj=JSON.parse(xhr.response);
            console.log(obj);
            console.log(obj.name);
            cityname.innerHTML="CITY : "+obj.name;
            airQualityContainer.children[0].innerHTML=obj.name;
            temperature.innerHTML="TEMP : "+(obj.main.temp-273.15).toFixed(2)+" °C";
            temp_min.innerHTML="temp_min : "+(obj.main.temp_min-273.15).toFixed(2)+" °C";
            temp_max.innerHTML="temp_max : "+(obj.main.temp_max-273.15).toFixed(2)+" °C";
            humidity.innerHTML="humidity : "+obj.main.humidity+"%";
            feels_like.innerHTML="feels_like : "+(obj.main.feels_like-273.15).toFixed(2)+" °C";
            cityDetail.latitude=obj.coord.lat.toFixed(2);
            cityDetail.longitude=obj.coord.lon.toFixed(2);
            initMap();
        }else{
            
        }
    }
    
    xhr.send();
    fetchAirQuality();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
   cityDetail.latitude= position.coords.latitude.toFixed(2)
   cityDetail.longitude=position.coords.longitude.toFixed(2)
   console.log('show pos calle');
   fetchTemp('Position');
   fetchAirQuality();
}
getLocation();


    // google maps 
// Initialize and add the map
    function initMap() {
    // The location of city
    
    const citty = { lat:parseFloat(cityDetail.latitude), lng:parseFloat(cityDetail.longitude)};
    // The map, centered at city
    const map = new google.maps.Map(document.getElementById("mapBox"), {
      zoom: 7,
      center: citty,
      mapTypeId: 'roadmap'
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: citty,
      map: map,
    });
  }

//----------------------------------------------------------------


//section game code
let btn_group=document.getElementsByClassName('btns')
let start_btn=document.getElementById('start_btn')
let beginBox=document.getElementById('beginBox')
let level_h1=document.getElementById('Level')
let exit_button=document.getElementById('exitgame')

let guessArray=[];
let updateGuess=0;
let UpdateGuessTemp=updateGuess;
let Played=[]
let level=0
let nInterval

let Button_Audio=document.createElement('audio')
Button_Audio.src='./button_sound.mp3'

let loop_audio=document.createElement('audio')
loop_audio.src='./loop_tune.mp3'
loop_audio.loop=true
loop_audio.volume=0.2
start_btn.onclick=()=>{
    start_btn.parentElement.style.visibility='hidden'
    startGame()
    exit_button.style.visibility='visible'
}
function startGame(){
    nInterval=setInterval(runn,1000)
    loop_audio.play()
}
function runn()
{
    let randomPress=Math.floor(Math.random()*btn_group.length)
    guessArray.push(randomPress);
    //console.log(guessArray);
    btn_group[randomPress].classList.add('play_anim')
    Button_Audio.play()
    setTimeout(()=>{
        btn_group[randomPress].classList.remove('play_anim')
        Button_Audio.pause()
        Button_Audio.currentTime=0
    },0800)
    clearInterval(nInterval)
    if(UpdateGuessTemp>0)
    {
        startGame()
        UpdateGuessTemp-=1
    }
}
for (let i = 0; i < btn_group.length; i++) {
   btn_group[i].addEventListener('click',()=>{
       Played.push(i)
       btn_group[i].classList.add('play_anim')
       Button_Audio.play()
       setTimeout(()=>{
        btn_group[i].classList.remove('play_anim')
        Button_Audio.pause()
        Button_Audio.currentTime=0
    },0800)

    if(Played.length==guessArray.length)
    {
        if(checkAndMove())
        {
            level+=1;
            level_h1.innerHTML="Level : "+level
            levelUp()
        }else{
            lossRestart()
        }
    }
   })
}
function checkAndMove(){
    for (let i = 0; i < Played.length; i++) {
        if(Played[i]!=guessArray[i])
        {
            return 0
        }else{
            continue
        }
    }
    return 1
}
function levelUp(){
    guessArray=[]
    Played=[]
    updateGuess+=1
    UpdateGuessTemp=updateGuess
    startGame()
}
function lossRestart(){
    loop_audio.pause()
    loop_audio.currentTime=0
    start_btn.parentElement.style.visibility='visible'
    guessArray=[]
    Played=[]
    updateGuess=0
    UpdateGuessTemp=updateGuess
    level=0;
        level_h1.innerHTML="Level : "+level
}
exit_button.addEventListener('click',()=>{
    lossRestart()
    exit_button.style.visibility='hidden'
})
//.-----------------------------------------------------------------------------

// pollution fetch 


function fetchAirQuality(){
    if(cityDetail.latitude!==null && cityDetail.longitude!==null)
    {
        let url2='https://api.openweathermap.org/data/2.5/air_pollution?lat='+cityDetail.latitude+'&lon='+cityDetail.longitude+'&appid='+apikey;
        const xhr2=new XMLHttpRequest();
        xhr2.open('GET',url2,true);
        xhr2.onload=()=>{
            if(xhr2.status==200)
            {
                //console.log(xhr2.response);
                let airobj=JSON.parse(xhr2.response)
                
                let aqilevel='';
                switch(airobj.list[0].main.aqi)
                {
                    case 1:
                        aqilevel='<span style="background:#5DD60A; padding:10px; border-radius:50px"> GOOD</span>'
                        break;
                    case 2:
                        aqilevel='<span style="background:#66ED9E; padding:10px; border-radius:50px"> FAIR</span>'
                        break;
                    case 3:
                        aqilevel='<span style="background:#51C3D6; padding:10px; border-radius:50px"> MODERATE</span>'
                        break;
                    case 4:
                        aqilevel='<span style="background:#FA4F0A; padding:10px; border-radius:50px"> POOR</span>'
                        break;
                    case 5:
                        aqilevel='<span style="background:#FA1900; padding:10px; border-radius:50px"> VERY POOR</span>'
                        break;
                }
                airQualityContainer.children[1].innerHTML="Air Quality is "+aqilevel;
                airQualityContainer.children[2].innerHTML=airobj.list[0].components.co+' μg/m<sup>3</sup> Сoncentration of CO (Carbon monoxide)'
                airQualityContainer.children[3].innerHTML=airobj.list[0].components.no+' μg/m<sup>3</sup> Сoncentration of NO (Nitrogen monoxide)'
                airQualityContainer.children[4].innerHTML=airobj.list[0].components.no2+' μg/m<sup>3</sup> Сoncentration of NO<sub>2</sub> (Nitrogen dioxide)'
                airQualityContainer.children[5].innerHTML=airobj.list[0].components.o3+' μg/m<sup>3</sup> Сoncentration of O<sub>3</sub> (Ozone)'
                airQualityContainer.children[6].innerHTML=airobj.list[0].components.so2+' μg/m<sup>3</sup> Сoncentration of SO<sub>2</sub> (Sulphur dioxide)'
                airQualityContainer.children[7].innerHTML=airobj.list[0].components.pm2_5+' μg/m<sup>3</sup> Сoncentration of PM<sub>2.5</sub> (Fine particles matter)'
                airQualityContainer.children[8].innerHTML=airobj.list[0].components.pm10+' μg/m<sup>3</sup> Сoncentration of PM<sub>10</sub> (Coarse particulate matter)'
                airQualityContainer.children[9].innerHTML=airobj.list[0].components.nh3+' μg/m<sup>3</sup> Сoncentration of NH<sub>3</sub> (Ammonia)'
            }
        }
        xhr2.send();
    }else{
        console.log('air quality not fetched');
    }

}
import React, {Component} from 'react';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Navigation from './Components/Navigation/Navigation.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

// import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey: '2ce4805be9c84909bd3560718ef8c51d'
// });

// const returnClarifaiRequestOptions = (imageUrl) => {

    
//     const PAT = 'e440847d64324e8795c896895d997099';
//     const USER_ID = 'jasonjamesmoore';       
//     const APP_ID = 'final-project';
//     const MODEL_ID = 'face-detection'; 
//     const IMAGE_URL = imageUrl;


//   const raw = JSON.stringify({
//     "user_app_id": {
//         "user_id": USER_ID,
//         "app_id": APP_ID
//     },
//     "inputs": [
//         {
//             "data": {
//                 "image": {
//                     "url": IMAGE_URL
//                 }
//             }
//         }
//     ]
// });

// const requestOptions = {
//   method: 'POST',
//   headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//   },
//   body: raw
// };
// return requestOptions
// }

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '', 
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // app.models
    // .predict(
    //   {
    //     id: 'face-detection',
    //     name: 'face-detection',
    //     version: '6dc7e46bc9124c5c8824be4822abe105',
    //     type: 'visual-detector',
    //   }, this.state.input)
    // fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
      fetch('https://face-recognition-app-w-user-signin-and.onrender.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://face-recognition-app-w-user-signin-and.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }  
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

onRouteChange = (route) => {
  if (route === 'signOut') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render() {
   const {isSignedIn, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
        ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onImageSubmit={this.onImageSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route === 'SignIn' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
          </div>
    );
  }
}

export default App;

// {/* <Navigation onRouteChange={this.onRouteChange} />
// { this.state.route === 'SignIn'
//   ?<SignIn onRouteChange={this.onRouteChange}/>
//   :<div>
//     <Logo />
//     <Rank />
//     <ImageLinkForm 
//       onInputChange={this.onInputChange} 
//       onButtonSubmit={this.onButtonSubmit}
//     />
//     <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
//   </div> */}
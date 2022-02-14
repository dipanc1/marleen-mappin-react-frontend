import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star } from "@material-ui/icons"
import "./app.css"
import axios from "axios"
import { format } from "timeago.js"
import Register from "./components/Register";
import Login from "./components/Login";
import HowToUse from "./components/HowToUse";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false)
  const [showHowToUse, setShowHowToUse] = useState(false)
  const [showlogin, setShowLogin] = useState(false)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins")
        // console.log(res.data)
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    };
    getPins()
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long })
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post("/pins", newPin)
      setPins([...pins, res.data]);
      setNewPlace(null);

    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoiZGlwYW5jMSIsImEiOiJja3h5bTlnb3MyMThrMnZvNXp6eXA5bjAwIn0.mF72r-5AtgGgcdOzl2v4og"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/dipanc1/ckup7vp6b7j9e17q1i8hypw17"
        onDblClick={handleAddClick}
        transitionDuration="300"
      >
        {pins.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}>

              <Room style={{ fontSize: viewport.zoom * 7, color: p.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace &&
          (<Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter A Title" onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Say Something About This Place" onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>)
        }
        <button className="buttonhowtouse" onClick={() => setShowHowToUse(true)}>How To Use?</button>
        {currentUser ? (<button className="button logout" onClick={handleLogout}>Log Out</button>) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Sign Up</button>
          </div>
        )}
        {showRegister &&
          <Register setShowRegister={setShowRegister} />
        }
        {showlogin &&
          <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />
        }
        {showHowToUse &&
          <HowToUse setShowHowToUse={setShowHowToUse} />
        }
      </ReactMapGL>

    </div>
  );
}

export default App;

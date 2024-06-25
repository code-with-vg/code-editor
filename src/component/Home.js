import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {v4 as uuid} from 'uuid';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generatedRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success('Room Id Is Created');
  };

  const joinRoom = () =>{
    if(!roomId || !username){
      toast.error('RoomId & Username are Requried')
      return;
    }
      
      navigate(`/Editor/${roomId}`,{
        state:{ username },
      });
      toast.success(`${username} Connected`)
      window.onpopstate = () =>{
        window.history.go(1);
      }
  }

  return <div className='container-fluid'>
    <div className='row justify-content-center align-items-center min-vh-100'>
    <div className='col-12 col-md-6'>
      <div className='card shadow-sm p-2 mb-5 bg-secondry rounded'>
        <div className='card-body text-center bg-dark'>
          <img  className="img-fluid mx-auto d-block mb-5" src='logo2.png' alt='LiveCode'style={{maxWidth:'285px',maxHeight:'180px'}}/>

          <h4 className='text-white mb-4'>Enter The Room Id</h4>
          <div className='form-group'>
            <input type='text' value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='form-control mb-4' placeholder='Room Id'/>
          </div>
          <div className='form-group'>
            <input type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='form-control mb-4' placeholder='Username'/>
          </div>
          <button onClick={joinRoom} className='btn btn-success btn-sl btn-block'>Join Room Now</button>

          <p className='mt-3 text-white'>Don't have a Room Id? <span className='text-success p-2' style={{cursor:'pointer'}} onClick={generatedRoomId}>New Room</span></p>
        </div>
      </div>
    </div>
    </div>

  </div>
}

export default Home
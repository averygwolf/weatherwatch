import React, {useContext, useState} from 'react';
import './App.css';
import {Input, Button } from 'antd'

const context = React.createContext()

/* structure can be reused for any app that has a lot of components */
function App() {
  const [state, setState] = useState({
    searchTerm: ''
  })
  return <context.Provider value={{
    ...state, 
    set: v=>setState({...state,...v}) /* take all the existing pieces of state, add new piece */
  }}>
    <div className="App">
      <Header />
      {state.error && <div>{state.error}</div>}
    </div>
  </context.Provider>
}

function Header() {
  const ctx = useContext(context)

  return <header className="App-header">
    <Input 
      value={ctx.searchTerm}
      onChange={e=>ctx.set({searchTerm:e.target.value})}
      style={{height:'3rem',fontSize:'2rem'}}
      onKeyPress={e=>{
        if(e.key==='Enter' && ctx.searchTerm) search()
      }}
    />
    <Button style={{marginLeft:5,height:'3rem'}}
      onClick={()=> search(ctx)} type='primary'
      disabled={!ctx.searchTerm}>
      Search
    </Button>
  </header>
}

/* sets input bar to an empty string and thus disable button */
async function search({searchTerm, set}) {
  try {
  const term = searchTerm
  set({searchTerm:'', error:''})

  const osmurl = `https://nominatim.openstreetmap.org/search/${term}?format=json`
  const r = await fetch(osmurl)
  const loc = await r.json()
  if(!loc[0]) {
    return set({error:'No city matching that query'})
  }
  const city = loc[0]
  console.log(city.lat, city.long)

  const key = '898f6d79e431313aba5628e741ebe3d3'
  const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
  const r2 = await fetch(url)
  const weather = await r2.json()
  set({weather})
  } catch(e) {
    set({error: e.message})
  }
}
export default App;

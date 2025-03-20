import { useState } from 'react'
import './App.css'
import Danmu from './Danmu'

function App() {

  const [danmakuItems, setDanmakuItems] = useState([
    { id: 1, avatar: 'https://i.pravatar.cc/40', name:'小熊是', text: '第一条嘻嘻嘻嘻嘻嘻休息休息阿阿斯顿法师' },
    { id: 2, avatar: 'https://i.pravatar.cc/40', name:'小熊1', text: '第二条第二条第二条' },
    { id: 3, avatar: 'https://i.pravatar.cc/40', name:'小熊2', text: '第三条' },
    { id: 4, avatar: 'https://i.pravatar.cc/40', name:'冲冲冲是啥啥啥', text: '这是第四条弹幕' },
    { id: 5, avatar: 'https://i.pravatar.cc/40', name:'粉色系', text: '这是第五条' },
  ]);

  return (
    <div style={{backgroundColor: 'darkcyan'}}>
        <Danmu danmus={danmakuItems} containerWidth={300} speed={120}></Danmu>
    </div>
  )
}

export default App

import { useState, useEffect, useRef } from "react";

interface DanmuItem {
  id: number;
  avatar: string;
  name: string;
  text: string;
  row: number;
  startTime: number;
}

function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;
    context.font = font;
    return context.measureText(text).width;
}

function getTrueTextWidth(text: string, font: string): number {
    const span = document.createElement('span');
    // 设置字体为 Arial
    span.style.fontFamily = 'Arial'; 
    span.style.fontSize = font;
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.textContent = text;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
}

interface DanmuProps {
    danmus: { avatar: string; name: string; text: string }[];
    rowCount?: number;
    containerWidth?: number;
    speed?: number; // px/s
    space?: number;
    loop?: boolean; // 是否循环
}
  
export const Danmu: React.FC<{
    danmus: { avatar: string; name: string; text: string }[],
    rowCount?: number,
    containerWidth?: number,
    speed?: number,
    space?: number,
    loop?: boolean
}> = ({
     danmus = [],
     rowCount = 2,
     containerWidth = 800,
     speed = 100,
     space = 15,
     loop = true
}) => {
  const [activeDanmus, setActiveDanmus] = useState<DanmuItem[]>([]);
  let rowNumber = rowCount
  if (danmus.length == 1) {
    rowNumber = 1
  }
  const rowRefs = useRef<number[]>(new Array(rowNumber).fill(0)); // 记录每行最后一条弹幕的结束时间
  const danmuQueue = useRef([...danmus]); // 弹幕队列

  let idCounter = 0;
  let delayTime = 0;
  useEffect(() => {
    const addDanmu = (avatar: string, name: string, text: string) => {
      const now = Date.now();
      let assignedRow = 0;

      // 找到最早可用的行
      const minRowIndex = rowRefs.current.reduce(
        (minIndex, time, index) => (time < rowRefs.current[minIndex] ? index : minIndex),
        0
      );
      assignedRow = minRowIndex;

      // 计算弹幕长度（头像 + 文字）
      const content = name + "：" + text
      const width = getTrueTextWidth(content, `12px`) + 30; 

      // 确保该行的弹幕不会重叠
      const availableTime = rowRefs.current[assignedRow]; // 该行上一次弹幕结束时间
      let startTime = Math.max(now, availableTime) + delayTime; // 计算新弹幕的实际开始时间
      rowRefs.current[assignedRow] = startTime + width/speed*1000 + space*1000/speed; // 更新该行的结束时间(间距)!

      setTimeout(() => {
        setActiveDanmus((prev) => [
          ...prev,
          { id: idCounter++, name, avatar, text, row: assignedRow, startTime },
        ]);
      }, startTime - now);
    };

    const addNextDanmu = () => {
      if (danmuQueue.current.length === 0) {
        if (loop) {
          danmuQueue.current = [...danmus]; // 重新填充队列，实现循环
        } else {
          return;
        }
      }
      const nextDanmu = danmuQueue.current.shift();
      if (nextDanmu) {
        addDanmu(nextDanmu.avatar, nextDanmu.name, nextDanmu.text);
      }
    };

    // 持续添加弹幕
    const interval = setInterval(() => {
      addNextDanmu();
    }, 200); 

    return () => clearInterval(interval);
   }, []);


  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: rowNumber * 50,
        overflow: "hidden",
        // background: "#000",
      }}
    >
      {activeDanmus.map(({ id, avatar, name, text, row }, index) => {
        const totalDistance = containerWidth*2; 
        const duration = totalDistance / speed;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              top: row * 35,
              left: 0,
              display: "flex",
              flexDirection: 'row',
              alignItems: "center",
              justifyContent: "center",
            //   gap: "10px",
              padding: 5,
              borderRadius: 12.5,
              background: "#FFFFFF99",
              whiteSpace: "nowrap",
              animationName: `moveLeft${id}`,
              animationDuration: `${duration}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards', 
            }}
            onAnimationEnd={() => {
              setActiveDanmus((prev) => prev.filter((d) => d.id !== id));
              if (loop) {
                danmuQueue.current.push({ avatar, name, text }); // 重新加入队列，实现循环
              }
            }}
          >
            <img
              src={avatar}
              alt="avatar"
              style={{
                width: 15,
                height: 15,
                marginRight: 4,
                borderRadius: "50%",
                border: "1px solid ##FFFFFF99"
              }}
            />
            <span style={{color:"#201E1F99", fontSize:12, fontFamily:'Arial', lineHeight:`12px`}}>{name+'：'}</span>
            <span style={{color:"#201E1F", fontSize:12, fontFamily:'Arial', lineHeight:`12px`}}>{text}</span>
          </div>
        );
      })}
      <style>
        {activeDanmus.map(
            ({ id }) => `
          @keyframes moveLeft${id} {
            from {
              transform: translateX(${containerWidth}px);
            }
            to {
              transform: translateX(-${containerWidth}px); 
          }
          }
        `
         )
          .join("")
        }
      </style>
    </div> )
}

export default Danmu;
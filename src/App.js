import React, { useEffect } from "react";
import { fabric } from "fabric";
import "./App.css";

const FabricExample = () => {
  const fabricRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const initFabric = () => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 1920,
      height: 1080,
    });
    // canvas 밖으로 넘어가지 않게
    fabricRef.current.on("object:moving", (e) => {
      let obj = e.target;
      let halfw = obj.width / 2;
      let halfh = obj.height / 2;
      let limit_l = obj.canvas.width - obj.width * obj.scaleX;
      let limit_b = obj.canvas.height - obj.height * obj.scaleX;
      let bounds = {
        tl: { x: halfw, y: halfh },
        br: { x: obj.canvas.width, y: obj.canvas.height },
      };
      if (obj.top < bounds.tl.y || obj.left < bounds.tl.x) {
        obj.top = Math.max(obj.top, 0);
        obj.left = Math.max(obj.left, 0);
      }
      if (
        obj.top + obj.height * obj.scaleX > bounds.br.y ||
        obj.left + obj.width * obj.scaleX > bounds.br.x
      ) {
        obj.top = Math.min(obj.top, limit_b);
        obj.left = Math.min(obj.left, limit_l);
      }
    });
  };
  const undo = () => {
    //단축키 컨트롤제트
  };
  const addRectangle = () => {
    const rect = new fabric.Rect({
      top: 500,
      left: 500,
      width: 500,
      height: 500,
      fill: "red",
      hasControls: false,
      moveCursor: "grab",
    });
    fabricRef.current.add(rect);
  };
  const removeObj = () => {
    const target = fabricRef.current.getActiveObject();
    fabricRef.current.remove(target);
  };
  const fileLoad = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => resolve(event);
      reader.onerror = (event) => reject(event);
      reader.readAsDataURL(file);
    });
  };
  const addImage = async (value) => {
    const image = value.target.files[0];
    const event = await fileLoad(image);
    const imgObj = new Image();
    imgObj.src = event.target.result;
    imgObj.onload = async () => {
      // 이미지가 정상적으로 로드되었다면 캔버스초기화
      fabricRef.current.imagePath = image.name;
      const img = new fabric.Image(imgObj, {
        hasControls: false,
        moveCursor: "grab",
      });
      img.set("type", "background");
      img.set("name", value.target.files[0].name);
      fabricRef.current.centerObject(img);
      fabricRef.current.add(img);
      value.target.value = "";
    };
    imgObj.onerror = (error) => {
      console.log(error);
      alert("이미지를 로드할 수 없습니다");
      value.target.value = "";
    };
  };
  const getJson = () => {
    const json = fabricRef.current.getObjects().map((e) => {
      return {
        type: e.type,
        fileName: e.name,
        y: e.top,
        x: e.left,
      };
    });
    console.log(json);
  };
  const disposeFabric = () => {
    fabricRef.current.dispose();
  };
  useEffect(() => {
    initFabric();
    // addRectangle();
    return () => {
      disposeFabric();
    };
  }, []);

  return (
    <div className="App">
      <div className="viewer">
        <div className="title"></div>
        <canvas className="canvas" ref={canvasRef} />
      </div>
      <div className="menu">
        <button onClick={removeObj}>선택 삭제</button>
        <button onClick={addRectangle}>addRectangle</button>
        <div className="background-input">
          <label for="background">배경 선택</label>
          <input type="file" id="background" onChange={addImage}></input>
        </div>
        <button onClick={getJson}>json 다운</button>
      </div>
    </div>
  );
};

export default FabricExample;

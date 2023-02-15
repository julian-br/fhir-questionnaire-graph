import { ReactNode } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useRef, useEffect, memo } from "react";

interface GraphContainerProps {
  children: ReactNode;
}

export default function GraphContainer({ children }: GraphContainerProps) {
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    transformWrapperRef.current?.resetTransform();
  }, [children]);

  return (
    <div className="h-full bg-slate-100">
      <TransformWrapper
        ref={transformWrapperRef}
        wheel={{ step: 0.2 }}
        limitToBounds={false}
        doubleClick={{
          disabled: true,
        }}
        minScale={0.6}
        maxScale={1.5}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

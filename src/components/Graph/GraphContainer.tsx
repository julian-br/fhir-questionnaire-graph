import { ReactNode } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface GraphContainerProps {
  children: ReactNode;
}

export default function GraphContainer({ children }: GraphContainerProps) {
  return (
    <div className="bg-slate-100">
      <TransformWrapper
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

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
        panning={{ velocityDisabled: true }}
        doubleClick={{
          disabled: true,
        }}
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

import { Steps } from "antd";
import React, { useState, useEffect } from "react";
import styles from "../styles.module.scss";

const { Step } = Steps;

interface StepListProps {
  step?: number;
  boundingRectTop?: number;
  listStepContent: any[];
  onClick: (key: string) => void;
}

const StepList: React.FC<StepListProps> = ({
  step,
  boundingRectTop,
  listStepContent,
  onClick,
}) => {
  const [scrollY, setScrollY] = useState<number>(0);

  function scrollAction() {
    setScrollY(window.pageYOffset);
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", scrollAction);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", scrollAction);
    };
  });

  const onActiveStep = (step: any) => {
    if (
      window.pageYOffset >= step.ref?.current?.offsetTop &&
      window.pageYOffset - 35 <=
        step.ref?.current?.offsetTop + step.ref?.current?.offsetHeight
    )
      return true;

    return false;
  };

  const StepTitle = ({ title, active }: any) => (
    <span className={active ? `active ${styles.active}` : ""}>{title}</span>
  );

  return (
    <Steps
      current={step}
      direction="vertical"
      size="small"
      progressDot
      className={`${styles.box_steps} ${
        boundingRectTop ? styles.className : ""
      }`}
    >
      {listStepContent.map((step, index) => {
        return (
          <Step
            title={<StepTitle title={step.key} active={onActiveStep(step)} />}
            onClick={() => onClick(step)}
            style={{ cursor: "pointer" }}
            key={index}
          />
        );
      })}
    </Steps>
  );
};

export default React.memo(StepList);

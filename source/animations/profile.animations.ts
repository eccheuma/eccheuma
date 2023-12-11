import { animations, AnimationProperties } from "./index";

export const enum IconStatus {
  start,
  pending,
  error,
  done,
}

export function iconAnimation(status: IconStatus) {

  const animationBase = (params: KeyframeAnimationOptions): AnimationProperties => {

    const base = animations.common.opacityResolve(animations.common.AnimationMode.Short, false);

    return Object.assign(base, { options: params });

  };

  switch (status) {
    case IconStatus.start:
      return animationBase({ direction: "reverse" });
    case IconStatus.pending:
      return animationBase({ direction: "alternate", iterations: Infinity });
    case IconStatus.error:
      return animationBase({ direction: "normal", duration: 100, iterations: 3 });
    case IconStatus.done:
      return animationBase({ direction: "normal", iterations: 1 });
  }

}
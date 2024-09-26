export interface AnimationProperties {
  keyframes: Array<Keyframe>,
  options: KeyframeAnimationOptions,
}

export namespace animations {

  export function asArrayParams(params: AnimationProperties): [Array<Keyframe>, KeyframeAnimationOptions] {
    return [params.keyframes, params.options];
  }

  export namespace common {

    export const enum AnimationMode {
      Short,
      Long,
    }

    export function opacityResolve(mode: AnimationMode, reverse: boolean): AnimationProperties {

      const BasicKeyframes: Array<Keyframe> = [
        { opacity: 0 },
        { opacity: 1 },
      ];

      const BaseOptions: KeyframeAnimationOptions = {
        fill: "both",
        easing: "ease-in-out",
        direction: reverse 
          ? "reverse" 
          : "normal",
      };

      switch (mode) {
        case AnimationMode.Long: return {
          keyframes: BasicKeyframes,
          options: Object.assign(BaseOptions, { duration: 1000 }),
        };
        case AnimationMode.Short: return {
          keyframes: BasicKeyframes,
          options: Object.assign(BaseOptions, { duration: 250 }),
        };
      }

    }

  }

}
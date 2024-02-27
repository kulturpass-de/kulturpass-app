/**
 * Calculate the duration in milliseconds from the schema
 */
export const calculateAnimationDuration = (lottieAnimation: any): number => {
  const startFrame = typeof lottieAnimation.ip === 'number' ? lottieAnimation.ip : 0
  const endFrame = typeof lottieAnimation.op === 'number' ? lottieAnimation.op : 60
  const frameRate = typeof lottieAnimation.fr === 'number' ? lottieAnimation.fr : 60

  return ((endFrame - startFrame) / frameRate) * 1000
}

export const getAnimationSize = (lottieAnimation: NonNullable<any>): { width: number; height: number } => {
  return {
    height: typeof lottieAnimation.h === 'number' ? lottieAnimation.h : 512,
    width: typeof lottieAnimation.w === 'number' ? lottieAnimation.w : 512,
  }
}

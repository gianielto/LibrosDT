export function clearErrorAfter(
  setter: (msg: string) => void,
  time: number = 5000
) {
  setTimeout(() => setter(""), time);
}

let _Uid = -1;
const nextId = () => {
  return 'uid_' + String(++_Uid);
}
export default {
  nextId
}

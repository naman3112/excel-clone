let str = "";
let n = 27;
while (n > 0) {
  let rem = n % 26;
  if(rem==0){
      str="Z";
      n=Math.floor(n/26)-1;
  }
  else{
str=String.fromCharCode((rem-1)+65)+str;
n=Math.floor(n/26);

  }

}
console.log(str);

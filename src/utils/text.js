const testCount = 100000;
const loopCount = 100000;
let duplicateDataCount = 0;

function testFunc(i) {
  const resultArray = Array(testCount)
    .fill('')
    .map(() => Math.random());
  const resultSet = new Set(resultArray);
  const arrLength = resultArray.length;
  const setSize = resultSet.size;

  if (arrLength !== setSize) {
    console.log(`在${i + 1}次循环发现重复随机数`);
    duplicateDataCount += arrLength - setSize;
  } else {
    console.log(`第${i + 1}次循环执行完毕，未发现重复随机数`);
  }

  if (i + 1 === loopCount) {
    console.log(
      `循环结束${
        duplicateDataCount === 0
          ? `未发现重复随机数`
          : `存在${duplicateDataCount}组相同的随机数`
      }`
    );
  }
}

for (let i = 0; i < loopCount; i++) {
  setTimeout(() => {
    testFunc(i);
  }, 1000);
}

// @ts-ignore
const diffFS = require('fs');

const diffPath = 'public/diff/'
const mergePath = 'src/locales/'


const diffPaths = diffFS.readdirSync(diffPath)
const mergePaths = diffFS.readdirSync(mergePath)


diffPaths.map((item:string,index:number)=>{
  let diffString = diffFS.readFileSync(diffPath + diffPaths[index],{ encoding: 'utf8', flag: 'r' });
  let mergeString = diffFS.readFileSync(mergePath + diffPaths[index],{ encoding: 'utf8', flag: 'r' });

  if (mergeString == ''){
    diffFS.writeFileSync(mergePath + diffPaths[index],diffString)
    console.log(diffPaths[index],`合并完成✅`)
  }else {
    mergeString = mergeString.replaceAll('"\n}','",\n')
    diffString = diffString.replaceAll('{\n','')
    mergeString += diffString
    console.log('mergeString===',mergeString)
    diffFS.writeFileSync(mergePath + diffPaths[index],mergeString)
    console.log(diffPaths[index],`合并完成✅`)
  }
})


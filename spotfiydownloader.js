const spotfiydl = require('spottydl')
const readline = require('readline')
const fs = require('fs')
var os = require('os')

var outputfilename = ''
var linksgb = []

const ux = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
var error = false
//folder checker
//mdkchecker()
// Process of downloading
console.log(`Console: Welcome to spotfiy download command prompt. What did you want to do?`)
console.log(`1) Read Spotfiy local database. Type "1"`)
console.log(`2) Paste your spotify link`)
console.log(``)
ux.question('Console: Insert the spotify link: ',ans =>{
    if (!ans.includes('spotify') && !ans.includes('playlist')){
    error = true
    if (ans.includes('1')){
        console.log(``)
        console.log(``)
        console.log(`Console: Spotfiy local database. Please follow the steps to get your playlist exports out`)
        console.log(`1) Go to https://exportify.net and select which playlist to export`)
        console.log(`2) After you finally export, please copy the path of that file and prepare to insert here.`)
        console.log(``)
        ux.question('Console: Insert path to file: ',ans =>{
            if (fs.existsSync(ans)){
                console.log(`Console: File has been found, ${ans}`)
                console.log(`Console: Preparing to read the file...`)
                var splitname = ans.split(`\\`)
                outputfilename = `C:/Users/${os.userInfo().username}/Downloads/${folderformat(splitname[splitname.length-1].split('.csv').join(''))}`

                var rl = readline.createInterface({
                    input: fs.createReadStream(ans)
                })
                var items = []
                rl.on('line',(data)=>{
                    items.push(data)
                })
                var filteritems = []
                rl.on('close',()=>{
                    for (let i = 1; i<items.length;i++){
                        var filtritems = items[i].split(',')
                        var ids = filtritems
                        console.log(`Console: OUTPUT ${ids[0]}`)
                        filteritems.push(ids[0])
                    }
                    console.log(`Console: Total found songs: ${filteritems.length} songs`)
                    console.log(`Console: Proceeding to download these ${filteritems.length} songs`)
                    linksgb = filteritems
                   callupplaylist()
                })
            }
        })
    } else{
    console.log('Console: Unfortunately, this link currently not supportable.')
    console.log('Console: All operation are completed. This command prompt is closing at 10 seconds')
    setTimeout(()=>{
        process.exit()
    },10000)
    }
    } else {
    console.log('Console: Please wait. I am downloading the songs, you may look at output folder for progress cheers')
    }



    if (!error){
        var link = ans
        var type = '';
        if (link.includes('track')){
            type = 'track'
        } else if (link.includes('album')){
            type = 'album'
        }
        
        console.log(`Console: Setting up to ${type} mode`)
        download(link,type,(status)=>{
            if (status == 'Done'){
                console.log('Console: Done.')
                console.log('Console: All operation are completed. This command prompt is closing at 10 seconds')
                setTimeout(()=>{
                    process.exit()
                },10000)
            }
        })
    }
})


function download (link,type,callback){
switch(type){
    case 'track':
        if(!fs.existsSync(`C:/Users/${os.userInfo().username}/Downloads/track`)){
            fs.mkdirSync(`C:/Users/${os.userInfo().username}/Downloads/track`)
        }
    spotfiydl.getTrack(link).then(result =>{
        console.log(`Console: Now downloading, ${result.title} by ${result.artist}, track number ${result.trackNumber}`)
    spotfiydl.downloadTrack(fileformat(result),`C:/Users/${os.userInfo().username}/Downloads/track`).then(result=>{
        console.log(`Console: This track completed the download \n You may retrieve at C:/Users/${os.userInfo().username}/Downloads/track`)
        callback('Done')
        })
    })
        break;
    case 'album':
        if(!fs.existsSync(`C:/Users/${os.userInfo().username}/Downloads/album`)){
            fs.mkdirSync(`C:/Users/${os.userInfo().username}/Downloads/album`)
        }
        spotfiydl.getAlbum(link).then(result =>{
            result.name = result.name.split('?').join('')
            result.name = `${result.name} by ${result.artist}`
            console.log(`Console: Now downloading, ${result.name} by ${result.artist}, track number ${result.tracks.length}`)
            spotfiydl.downloadAlbum(result,`C:/Users/${os.userInfo().username}/Downloads/album`).then(result=>{
                console.log(`Console: This track completed the download \n You may retrieve at C:/Users/${os.userInfo().username}/Downloads/album`)
                callback('Done')
                })
            })
        break;
}
}
var index = 0;
function callupplaylist(){
    mdkchecker()
    downloadplaylist()
}
var errorlog = []
var tryes = 0

function downloadplaylist(){
    if (index < linksgb.length){
        console.log(`URL ID: ${linksgb[index]}`)
        if (!linksgb[index] !== ''){
            spotfiydl.getTrack(`https://open.spotify.com/track/${linksgb[index]}`).then(result =>{
                if (result.id === null || result.id === undefined || result.id == '' || result === undefined || result === null){
                    errorhandler(true)
                } else{
                    console.log(`Console: Now downloading, ${result.title} by ${result.artist}, track number ${result.trackNumber}`)
                    try{
                        spotfiydl.downloadTrack(fileformat(result),outputfilename).then(result=>{
                            console.log('Console: This track completed the download')
                            console.log(`Current progress: ${index+1}/${linksgb.length}`)
                            tryes = 0
                            console.log(' ')
                            index++
                            callupplaylist()
                            })
                    } catch {
                        errorhandler(true)
                    }
                }
            }).catch(error=>{
                errorhandler(true)
            })
        }
        if (linksgb[index] === ''){
            errorhandler(true)
        }
    } else {
        if (errorlog.length>0){
            console.log(`Console: There is error encouter. Fetching the Error log`)
                var rl = readline.createInterface({
                    input: fs.createReadStream(ans)
                })
                var items = []
                rl.on('line',(data)=>{
                    items.push(data)
                })
                rl.on('close',()=>{
                    for (let errorv = 0; errorv>errorlog.length;errorv++){
                        for (let i = 1; i<items.length;i++){
                            var filtritems = items[i].split(',')
                            var ids = filtritems
                            if (errorlog[errorv].includes(ids[0])){
                                console.log(`Console: This track has some issues: ${ids[2]} by ${ids[3]}`)
                            }
                        }
                    }
                    console.log(`Console: You may retrieve your music on ${outputfilename}`)
                    console.log('Console: All operation has completed. Please ctrl+c to restart or close.')
                })
        } else {
            console.log(`Console: You may retrieve your music on ${outputfilename}`)
            console.log('Console: All operation has completed. Please ctrl+c to restart or close.')
        }
    }
}
function mdkchecker(){
//folder checker
if(!fs.existsSync(outputfilename)){
    fs.mkdirSync(outputfilename)
}
}

function errorhandler(error){
    if (tryes>2 && error == true){
        console.log('Console: This track has error, proceed to skip')
        console.log(`Current progress: ${index+1}/${linksgb.length}`)
        errorlog.push(index)
        setTimeout(()=>{
            tryes = 0
            console.log(' ')
            index++
            callupplaylist()
        },500)
    } else {
        setTimeout(()=>{
            console.log('Console: This track has error, attempt to retry')
            console.log(`Current progress: ${index+1}/${linksgb.length}`)
            console.log(' ')
            tryes++
            callupplaylist()
        },1000)
    }
}

function fileformat(result){
    //Remove all special chara
    try{
        result.title = result.title.split('?').join('')
        result.title = result.title.split('"').join('')
        result.title = result.title.split('#').join('')
        result.title = result.title.split('&').join('')
        result.title = result.title.split('{').join('')
        result.title = result.title.split('}').join('')
        result.title = result.title.split(`\\`).join('')
        result.title = result.title.split('<').join('')
        result.title = result.title.split('>').join('')
        result.title = result.title.split('?').join('')
        result.title = result.title.split('/').join('')
        result.title = result.title.split('$').join('')
        result.title = result.title.split('!').join('')
        result.title = result.title.split(`'`).join('')
        result.title = result.title.split(`:`).join('')
        result.title = result.title.split(`@`).join('')
        result.title = result.title.split(`+`).join('')
        result.title = result.title.split('`').join('')
        result.title = result.title.split(`|`).join('')
        result.title = result.title.split(`(`).join('')
        result.title = result.title.split(`)`).join('')
        result.title = result.title.split(`=`).join('')
        result.title = result.title.split(` `).join(' ')
    
        result.artist = result.artist.split('?').join('')
        result.artist = result.artist.split('"').join('')
        result.artist = result.artist.split('#').join('')
        result.artist = result.artist.split('&').join('')
        result.artist = result.artist.split('{').join('')
        result.artist = result.artist.split('}').join('')
        result.artist = result.artist.split(`\\`).join('')
        result.artist = result.artist.split('<').join('')
        result.artist = result.artist.split('>').join('')
        result.artist = result.artist.split('?').join('')
        result.artist = result.artist.split('/').join('')
        result.artist = result.artist.split('$').join('')
        result.artist = result.artist.split('!').join('')
        result.artist = result.artist.split(`'`).join('')
        result.artist = result.artist.split(`:`).join('')
        result.artist = result.artist.split(`@`).join('')
        result.artist = result.artist.split(`+`).join('')
        result.artist = result.artist.split('`').join('')
        result.artist = result.artist.split(`|`).join('')
        result.artist = result.artist.split(`(`).join('')
        result.artist = result.artist.split(`)`).join('')
        result.artist = result.artist.split(`=`).join('')
        result.artist = result.artist.split(` `).join(' ') 
    } catch (e){
        errorhandler(true)
    }



    result.title = `${result.title} by ${result.artist}`
    return result
}

function folderformat(filename){
    //Remove all special chara
    try{
        filename = filename.split('?').join('')
        filename = filename.split('"').join('')
        filename = filename.split('#').join('')
        filename = filename.split('&').join('')
        filename = filename.split('{').join('')
        filename = filename.split('}').join('')
        filename = filename.split(`\\`).join('')
        filename = filename.split('<').join('')
        filename = filename.split('>').join('')
        filename = filename.split('?').join('')
        filename = filename.split('/').join('')
        filename = filename.split('$').join('')
        filename = filename.split('!').join('')
        filename = filename.split(`'`).join('')
        filename = filename.split(`:`).join('')
        filename = filename.split(`@`).join('')
        filename = filename.split(`+`).join('')
        filename = filename.split('`').join('')
        filename = filename.split(`|`).join('')
        filename = filename.split(`(`).join('')
        filename = filename.split(`)`).join('')
        filename = filename.split(`=`).join('')
        filename = filename.split(` `).join(' ')
    
    } catch (e){
        throw e
    }

    return filename
}
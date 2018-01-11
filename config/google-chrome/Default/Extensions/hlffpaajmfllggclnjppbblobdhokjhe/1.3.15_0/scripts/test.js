function log(message) {
  const textarea = document.querySelector("#output");
  const value = textarea.value;
  textarea.value = message + "\n" + value;
}

Raven.config('https://8f30bd158dea44d2ad5dbce094b67274@sentry.io/189250').install();
console.log("Sentry initialized.");

const dropboxClient = new DropboxClient();

document.querySelector("#btn_authorize").addEventListener("click", () => {
  dropboxClient.authorize(() => {
    log("successCallback called." );
  }, (error) => {
    log(error);
  });
  log("Finish - btn_authorize");
});

document.querySelector("#btn_unauthorize").addEventListener("click", () => {
  dropboxClient.unauthorize(() => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_unauthorize");
});

document.querySelector("#btn_getUserInfo").addEventListener("click", () => {
  dropboxClient.getUserInfo((user) => {
    log(JSON.stringify(user));
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_getUserInfo");
});

document.querySelector("#btn_getMetadata").addEventListener("click", () => {
  dropboxClient.getMetadata(document.querySelector("#path").value, (metadata) => {
    log(JSON.stringify(metadata));
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_getMetadata");
});

document.querySelector("#btn_readDirectory").addEventListener("click", () => {
  dropboxClient.readDirectory(document.querySelector("#path").value, (entries) => {
    log(JSON.stringify(entries));
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_readDirectory");
});

document.querySelector("#btn_createDirectory").addEventListener("click", () => {
  dropboxClient.createDirectory(document.querySelector("#path").value, () => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_createDirectory");
});

document.querySelector("#btn_deleteEntry").addEventListener("click", () => {
  dropboxClient.deleteEntry(document.querySelector("#path").value, () => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_deleteEntry");
});

document.querySelector("#btn_moveEntry").addEventListener("click", () => {
  dropboxClient.moveEntry(document.querySelector("#path").value, document.querySelector("#target").value, () => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_moveEntry");
});

document.querySelector("#btn_copyEntry").addEventListener("click", () => {
  dropboxClient.copyEntry(document.querySelector("#path").value, document.querySelector("#target").value, () => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_copyEntry");
});

document.querySelector("#btn_readFile").addEventListener("click", () => {
  dropboxClient.readFile(document.querySelector("#path").value,
        Number(document.querySelector("#offset").value), Number(document.querySelector("#length").value), (buffer, result) => {
    log(buffer.byteLength);
    log(outputUint8Array(new Uint8Array(buffer)));
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_readFile");
});

document.querySelector("#btn_truncate").addEventListener("click", () => {
    dropboxClient.truncate(document.querySelector("#path").value,
        Number(document.querySelector("#length").value), () => {
            log("successCallback called.");
        }, (error) => {
            log(error);
        });
    log("Finish - btn_truncate");
});

document.querySelector("#btn_createFile").addEventListener("click", () => {
  dropboxClient.createFile(document.querySelector("#path").value, () => {
    log("successCallback called.");
  }, (error) => {
    log(error);
  });
  log("Finish - btn_createFile");
});

document.querySelector("#btn_openFile").addEventListener("click", () => {
    dropboxClient.openFile(document.querySelector("#path").value, Number(document.querySelector("#openRequestId").value), "WRITE", () => {
        log("successCallback called.");
    }, (error) => {
        log(error);
    });
    log("Finish - btn_openFile");
});

document.querySelector("#btn_writeFile").addEventListener("click", () => {
    var data = string_to_buffer(document.querySelector("#content").value);
    dropboxClient.writeFile(document.querySelector("#path").value, data,
        Number(document.querySelector("#offset").value), Number(document.querySelector("#openRequestId").value), () => {
        log("successCallback called.");
    }, (error) => {
        log(error);
    });
    log("Finish - btn_writeFile");
});

document.querySelector("#btn_closeFile").addEventListener("click", () => {
    dropboxClient.closeFile(document.querySelector("#path").value, Number(document.querySelector("#openRequestId").value), () => {
        log("successCallback called.");
    }, (error) => {
        log(error);
    });
    log("Finish - btn_closeFile");
});

document.querySelector("#btn_429").addEventListener("click", () => {
    for (let i = 0; i < 300; i++) {
        // dropboxClient.getMetadata(document.querySelector("#path").value, (metadata) => {
        //     log(JSON.stringify(metadata));
        //     log("successCallback called.");
        // }, (error) => {
        //     log(error);
        // });
        dropboxClient.readDirectory(document.querySelector("#path").value, (entries) => {
            log(JSON.stringify(entries));
            log("successCallback called.");
        }, (error) => {
            log(error);
        });
    }
    log("Finish - btn_429");
});

var string_to_buffer = function(str){
    var n = str.length,
        idx = -1,
        bytes = [],
        i, j, c;

    for(i = 0; i < n; ++i){
        c = str.charCodeAt(i);
        if(c <= 0x7F){
            bytes[++idx] = c;
        } else if(c <= 0x7FF){
            bytes[++idx] = 0xC0 | (c >>> 6);
            bytes[++idx] = 0x80 | (c & 0x3F);
        } else if(c <= 0xFFFF){
            bytes[++idx] = 0xE0 | (c >>> 12);
            bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
            bytes[++idx] = 0x80 | (c & 0x3F);
        } else {
            bytes[++idx] = 0xF0 | (c >>> 18);
            bytes[++idx] = 0x80 | ((c >>> 12) & 0x3F);
            bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
            bytes[++idx] = 0x80 | (c & 0x3F);
        }
    }
    return (new Uint8Array(bytes)).buffer;
}

var outputUint8Array = function(array) {
  var lines = "";
  var out = "";
  var ascii = "";
  for (var i = 0; i < array.length; i++) {
    // out += String.fromCharCode(array[i]);
    var value = (Number(array[i])).toString(16).toUpperCase();
    if (value.length === 1) {
      value = "0" + value;
    }
    out += value;
    if (i % 2 !== 0) {
      out += " ";
    }
    if (0x20 <= array[i] && array[i] <= 0x7e) {
      ascii += String.fromCharCode(array[i]);
    } else {
      ascii += ".";
    }
    if (((i + 1) % 16) === 0) {
      lines += out + " " + ascii + "\n";
      out = "";
      ascii = "";
    }
  }
  if (out) {
    lines += out + " " + ascii + "\n";
  }
  return lines;
};

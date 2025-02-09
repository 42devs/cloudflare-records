/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 773:
/***/ ((module) => {

"use strict";
module.exports = require("node:fetch");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const fetch = __nccwpck_require__(773);

const {
  INPUT_TOKEN: token,
  INPUT_ZONE: zone,
  INPUT_TYPE: type,
  INPUT_NAME: name,
  INPUT_CONTENT: content,
  INPUT_TTL: ttl,
  INPUT_PROXIED: proxied, 
} = process.env;

const baseURL = 'https://api.cloudflare.com/client/v4/zones';

const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json',i
      };

  const recordData = {
      type,
      name,
      content,
      ttl: Number(ttl),
      proxied,
    };

const getCurrentRecordId = async () => {
  const url = `${baseURL}/${zone}/dns_records?name=${name}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! status ${res.status}`)
    }

    const data = await res.json()

    if (data.success && data.result.length > 0) {
      const recordId = data.result[0].id;
      return recordId;
    } else {
      return null;
    }
    
  } catch (error) {
    console.log(`::error ::${error.message}`)
    process.exit(1);
  }
}

const createRecord = async  () => {
  try {
   const url = `${baseURL}/${zone}/dns_records`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(recordData),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! status ${res.status}`);
    }

    const {result, success, errors} = await res.json()

    if (!success) {
      
      throw new Error(errors[0].message);
    }
      console.log(`::set-output name=record_id::${result.id}`);
      console.log(`:: set-outpur name=name::${result.name}`);
  } catch (error) {
  console.log(`::error ::${error.message}`);
    process.exit(1);
  }
}

const updateRecord = async(id) => {
  try {
    const url = `${baseURL}/${zone}/dns_records/${id}`;
    const res = await fetch(url, {
      method: PUT,
      headers,
      body: JSON.stringify(recordData),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! status ${res.status}`);
    }

    const {result, success, errors} = await res.json();

    if (!success) {
      throw new Error(`::error ::${errors[0].message}`);
    }

    console.log(`::set-output name=record_id::${result.id}`);
  console.log(`::set-output name=name::${result.name}`);
  } catch (error) {
  console.log(`::error ::${error.message}`)
    process.exit(1);
  }
}


getCurrentRecordId()
  .then(async (id) => {
    if (id) {
      await updateRecord(id);
    } else {
      await createRecord();
    }
    process.exit(0)
  })


module.exports = __webpack_exports__;
/******/ })()
;
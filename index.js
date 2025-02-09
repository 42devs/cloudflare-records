const fetch = require('node-fetch');

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


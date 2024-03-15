export const newCompanyDataObject = {
  staticFields: [
    {
      key: "name",
      name: 'Company name',
      display: "Your company name",
      type: 'text',
      encryptable: false
    },
    {
      key: "purpose",
      name: 'Purpose',
      display: 'Truthful scope of business',
      type: 'text',
      encryptable: false
    },
    {
      key: "logoURL",
      name: 'Logo URL',
      display: 'URL to logo',
      type: 'text',
      encryptable: false
    },
    {
      key: "charterURL",
      name: 'Charter URL',
      display: 'Charter URL',
      type: 'text',
      encryptable: false
    },
    {
      key: "totalCapitalAmount",
      name: 'Total Capital Amount',
      display: 'Total capital amount',
      type: 'text',
      encryptable: false
    },
    {
      key: "totalCapitalCurrency",
      name: 'Total Capital Currency',
      display: 'Total capital currency',
      type: 'text',
      encryptable: false
    },
    {
      key: "numberOfShares",
      name: 'Number of Shares',
      display: 'Total number of shares',
      type: 'text',
      encryptable: false
    },
    {
      key: "valuePerShare",
      name: 'Value per share',
      display: 'Value per share',
      type: 'text',
      encryptable: false
    },
    {
      key: "history",
      name: 'History',
      display: 'History of transfer of shares',
      type: 'text',
      encryptable: false
    },
    {
      key: "registryAllowedToEdit",
      name: 'Registry allowed to edit',
      display: 'Allow registry to edit details on-chain. Required for registration',
      type: 'checkbox',
      encryptable: false
    }
  ],
  dynamicFields: [
    {
      key: "brandNames",
      display: 'List of brand names the company is doing business as',
      name: 'Brand Name',
      fields: [
        {
          key: 'name',
          display: 'Brand Name',
          type: 'text',
          encryptable: true
        },
      ],
      data: [
        [{
          key: 'name',
          display: 'Brand Name',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "onlineAddresses",
      display: 'List of all online addresses',
      name: 'Online Address',
      fields: [
        {
          key: 'description',
          display: 'Description of online address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'url',
          display: 'URL of online address',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'description',
          display: 'Description of online address',
          isEncrypted: false
        },
        {
          key: 'url',
          display: 'URL of online address',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "physicalAddresses",
      display: 'List of all physical addresses',
      name: 'Physical Address',
      fields: [
        {
          key: 'description',
          display: 'Description of physical address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'street',
          display: 'Street',
          type: 'text',
          encryptable: true
        },
        {
          key: 'city',
          display: 'city',
          type: 'text',
          encryptable: true
        },
        {
          key: 'subdivision',
          display: 'Subdivision - state/province/emirate/oblast/etc',
          type: 'text',
          encryptable: true
        },
        {
          key: 'postalCode',
          display: 'Postal Code',
          type: 'text',
          encryptable: true
        },
        {
          key: 'country',
          display: 'Country id - make me a list',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'description',
          display: 'Description of physical address',
          isEncrypted: false
        },
        {
          key: 'street',
          display: 'Street',
          isEncrypted: false
        },
        {
          key: 'city',
          display: 'city',
          isEncrypted: false
        },
        {
          key: 'subdivision',
          display: 'Subdivision - state/province/emirate/oblast/etc',
          isEncrypted: false
        },
        {
          key: 'postalCode',
          display: 'Postal Code',
          isEncrypted: false
        },
        {
          key: 'country',
          display: 'Country id - make me a list',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "principals",
      display: 'List of principals',
      name: 'Principal',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'name',
          display: 'Name of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'dob',
          display: 'Date of Birth of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'passportNumber',
          display: 'Passport number of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'shares',
          display: 'Number of shares of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'signingAbility',
          display: 'Can be full or other',
          type: 'text',
          encryptable: true
        },
        {
          key: 'signingAbilityConditions',
          display: 'Any conditions on principal signing ability. Must be in agreement',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'walletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'name',
          display: 'Name of principal',
          isEncrypted: false
        },
        {
          key: 'dob',
          display: 'Date of Birth of principal',
          isEncrypted: false
        },
        {
          key: 'passportNumber',
          display: 'Passport number of principal',
          isEncrypted: false
        },
        {
          key: 'shares',
          display: 'Number of shares of principal',
          isEncrypted: false
        },
        {
          key: 'signingAbility',
          display: 'Can be full or other',
          isEncrypted: false
        },
        {
          key: 'signingAbilityConditions',
          display: 'Any conditions on principal signing ability. Must be in agreement',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "shareholders",
      display: 'List of all shareholders',
      name: 'Shareholder',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'name',
          display: 'Name of shareholder',
          type: 'text',
          encryptable: true
        },
        {
          key: 'dob',
          display: 'Date of Birth of shareholder',
          type: 'text',
          encryptable: true
        },
        {
          key: 'passportNumber',
          display: 'Passport number of shareholder',
          type: 'text',
          encryptable: false
        },
        {
          key: 'shares',
          display: 'Number of shares of shareholder',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'walletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'name',
          display: 'Name of shareholder',
          isEncrypted: false
        },
        {
          key: 'dob',
          display: 'Date of Birth of shareholder',
          isEncrypted: false
        },
        {
          key: 'passportNumber',
          display: 'Passport number of shareholder',
          isEncrypted: false
        },
        {
          key: 'shares',
          display: 'Number of shares of shareholder',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "UBOs",
      display: 'List of all Ultimate Beneficiaries',
      name: 'Ultimate Beneficiary',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'name',
          display: 'Name of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'dob',
          display: 'Date of Birth of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'passportNumber',
          display: 'Passport number of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'signingAbility',
          display: 'Can be full or other',
          type: 'text',
          encryptable: true
        },
        {
          key: 'signingAbilityConditions',
          display: 'Any conditions on UBO signing ability. Must be in agreement',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'walletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'name',
          display: 'Name of UBO',
          isEncrypted: false
        },
        {
          key: 'dob',
          display: 'Date of Birth of UBO',
          isEncrypted: false
        },
        {
          key: 'passportNumber',
          display: 'Passport number of UBO',
          isEncrypted: false
        },
        {
          key: 'signingAbility',
          display: 'Can be full or other',
          isEncrypted: false
        },
        {
          key: 'signingAbilityConditions',
          display: 'Any conditions on UBO signing ability. Must be in agreement',
          isEncrypted: false
        }]
      ]
    }
  ]
}

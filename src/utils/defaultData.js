export const newCompanyDataObject = {
  staticFields: [
    {
      key: "companyName",
      name: 'Company name',
      display: "Your company name",
      type: 'text',
      encryptable: false
    },
    {
      key: "purpose",
      name: 'Purpose',
      display: 'Thruthful scope of business',
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
      key: "BrandNames",
      display: 'List of brand names the company is doing business as',
      name: 'Brand Name',
      fields: [
        {
          key: 'brandName',
          display: 'Brand Name',
          type: 'text',
          encryptable: true
        },
      ],
      data: [
        [{
          key: 'brandName',
          display: 'Brand Name',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "OnlineAddresses",
      display: 'List of all online addresses',
      name: 'Online Address',
      fields: [
        {
          key: 'onlineAddressDescription',
          display: 'Description of online address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'onlineAddressURL',
          display: 'URL of online address',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'onlineAddressDescription',
          display: 'Description of online address',
          isEncrypted: false
        },
        {
          key: 'onlineAddressURL',
          display: 'URL of online address',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "PhysicalAddresses",
      display: 'List of all physical addresses',
      name: 'Physical Address',
      fields: [
        {
          key: 'physicalAddressDescription',
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
          key: 'Country',
          display: 'Country id - make me a list',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'physicalAddressDescription',
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
          key: 'Country',
          display: 'Country id - make me a list',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "StatuatoryOrganMembers",
      display: 'List of statuatory organ members',
      name: 'Statuatory Organ Member',
      fields: [
        {
          key: 'statuatoryOrganMemberWalletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'statuatoryOrganMemberName',
          display: 'Name of statuatory organ member',
          type: 'text',
          encryptable: true
        },
        {
          key: 'statuatoryOrganMemberDOB',
          display: 'Date of Birth of statuatory organ member',
          type: 'text',
          encryptable: true
        },
        {
          key: 'statuatoryOrganMemberPassportNumber',
          display: 'Passport number of statuatory organ member',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'statuatoryOrganMemberWalletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'statuatoryOrganMemberName',
          display: 'Name of statuatory organ member',
          isEncrypted: false
        },
        {
          key: 'statuatoryOrganMemberDOB',
          display: 'Date of Birth of statuatory organ member',
          isEncrypted: false
        },
        {
          key: 'statuatoryOrganMemberPassportNumber',
          display: 'Passport number of statuatory organ member',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "Principals",
      display: 'List of principals',
      name: 'Principal',
      fields: [
        {
          key: 'principalWalletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalName',
          display: 'Name of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalDOB',
          display: 'Date of Birth of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalPassportNumber',
          display: 'Passport number of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalShares',
          display: 'Number of shares of principal',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalSigningAbility',
          display: 'Can be full or other',
          type: 'text',
          encryptable: true
        },
        {
          key: 'principalSigningAbilityConditions',
          display: 'Any conditions on principal signing ability. Must be in agreement',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'principalWalletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'principalName',
          display: 'Name of principal',
          isEncrypted: false
        },
        {
          key: 'principalDOB',
          display: 'Date of Birth of principal',
          isEncrypted: false
        },
        {
          key: 'principalPassportNumber',
          display: 'Passport number of principal',
          isEncrypted: false
        },
        {
          key: 'principalShares',
          display: 'Number of shares of principal',
          isEncrypted: false
        },
        {
          key: 'principalSigningAbility',
          display: 'Can be full or other',
          isEncrypted: false
        },
        {
          key: 'principalSigningAbilityConditions',
          display: 'Any conditions on principal signing ability. Must be in agreement',
          isEncrypted: false
        }]
      ]
    },
    {
      key: "Shareholders",
      display: 'List of all shareholders',
      name: 'Shareholder',
      fields: [
        {
          key: 'shareHolderWalletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'shareHOlderName',
          display: 'Name of shareholder',
          type: 'text',
          encryptable: true
        },
        {
          key: 'shareholderDOB',
          display: 'Date of Birth of shareholder',
          type: 'text',
          encryptable: true
        },
        {
          key: 'shareholderPassportNumber',
          display: 'Passport number of shareholder',
          type: 'text',
          encryptable: false
        },
        {
          key: 'shareholderNumberOfShare',
          display: 'Number of shares of shareholder',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'shareHolderWalletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'shareHOlderName',
          display: 'Name of shareholder',
          isEncrypted: false
        },
        {
          key: 'shareholderDOB',
          display: 'Date of Birth of shareholder',
          isEncrypted: false
        },
        {
          key: 'shareholderPassportNumber',
          display: 'Passport number of shareholder',
          isEncrypted: false
        },
        {
          key: 'shareholderNumberOfShare',
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
          key: 'UBOWalletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'UBOName',
          display: 'Name of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'UBODOB',
          display: 'Date of Birth of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'UBOPassportNumber',
          display: 'Passport number of UBO',
          type: 'text',
          encryptable: true
        },
        {
          key: 'UBOSigningAbility',
          display: 'Can be full or other',
          type: 'text',
          encryptable: true
        },
        {
          key: 'UBOSigningAbilityConditions',
          display: 'Any conditions on UBO signing ability. Must be in agreement',
          type: 'text',
          encryptable: true
        }
      ],
      data: [
        [{
          key: 'UBOWalletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false
        },
        {
          key: 'UBOName',
          display: 'Name of UBO',
          isEncrypted: false
        },
        {
          key: 'UBODOB',
          display: 'Date of Birth of UBO',
          isEncrypted: false
        },
        {
          key: 'UBOPassportNumber',
          display: 'Passport number of UBO',
          isEncrypted: false
        },
        {
          key: 'UBOSigningAbility',
          display: 'Can be full or other',
          isEncrypted: false
        },
        {
          key: 'UBOSigningAbilityConditions',
          display: 'Any conditions on UBO signing ability. Must be in agreement',
          isEncrypted: false
        }]
      ]
    }
  ]
}


export const newCompanyExampleDataObject = {
  staticFields: [
    {
      key: "companyName",
      display: "Your company name",
      type: 'text',
      encryptable: false
    },
    {
      key: "companyId",
      display: 'should be filled by registrar. maybe a index in blockchain?',
      type: 'text',
      encryptable: false
    }
  ],
  dynamicFields: [
    {
      key: "brandNames",
      display: 'List of brand names the company is doing business as',
      name: 'Brand Name',
      data: [
        [
          {
            key: 'brandName',
            display: 'ACME',
            type: 'text',
            isEncrypted: true
          }
        ],
        [
          {
            key: 'brandName',
            display: 'Some cartoon company',
            type: 'text',
            isEncrypted: true
          }
        ],
      ],
      fields: [
        {
          key: 'brandName',
          display: 'Brand name',
          type: 'text',
          encryptable: true
        },
      ]
    },
    {
      key: "onlineAddresses",
      display: 'List of all online addresses',
      name: 'Online Address',
      data: [
        [
          {
            key: 'onlineAddressDescription',
            display: 'company website',
            type: 'text',
            isEncrypted: false
          },
          {
            key: 'onlineAddressURL',
            display: 'www.google.com',
            type: 'text',
            isEncrypted: false
          }
        ],
        [
          {
            key: 'onlineAddressDescription',
            display: 'Some weird site',
            type: 'text',
            isEncrypted: true
          },
          {
            key: 'onlineAddressURL',
            display: 'www.fanexus.com',
            type: 'text',
            isEncrypted: true
          }
        ]
      ],
      fields: [
        {
          key: 'onlineAddressDescription',
          display: 'Description of online address',
          type: 'text',
          encryptable: true
        },
        {
          key: 'onlineAddressURL',
          display: 'URL of online address',
          type: 'text',
          encryptable: true
        }
      ]
    },
  ]
}

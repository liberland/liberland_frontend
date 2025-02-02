export const newCompanyDataObject = {
  staticFields: [
    {
      key: 'name',
      name: 'Company name',
      display: 'Your company name',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'purpose',
      name: 'Description',
      display: 'Truthful scope of business',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'logoURL',
      name: 'Logo URL (optional)',
      display: 'URL to logo',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'charterURL',
      name: 'Charter URL (optional)',
      display: 'Charter URL',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'totalCapitalAmount',
      name: 'Total Capital Amount (optional)',
      display: 'Total capital amount',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'totalCapitalCurrency',
      name: 'Total Capital Currency (optional)',
      display: 'Total capital currency',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'numberOfShares',
      name: 'Number of Shares (optional)',
      display: 'Total number of shares',
      type: 'text',
      encryptable: false,
    },
    {
      key: 'companyType',
      name: 'Company Type',
      display: 'Company Type',
      type: 'radio',
      encryptable: false,
    },
  ],
  dynamicFields: [
    {
      key: 'brandNames',
      display: 'List of brand names the company is doing business as',
      name: 'Brand Name',
      fields: [
        {
          key: 'name',
          display: 'Brand Name',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [
        [{
          key: 'name',
          display: 'Brand Name',
          isEncrypted: false,
        }],
      ],
    },
    {
      key: 'onlineAddresses',
      display: 'List of all online addresses',
      name: 'Online Address',
      fields: [
        {
          key: 'description',
          display: 'Description of online address',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'url',
          display: 'URL of online address',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [
        [{
          key: 'description',
          display: 'Description of online address',
          isEncrypted: false,
        },
        {
          key: 'url',
          display: 'URL of online address',
          isEncrypted: false,
        }],
      ],
    },
    {
      key: 'contact',
      display: 'List of contacts',
      name: 'Contact info (optional)',
      fields: [
        {
          key: 'contact',
          display: 'Contact info (optional)',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [
        [{
          key: 'contact',
          display: 'Contact info (optional)',
          isEncrypted: false,
        }],
      ],
    },
    {
      key: 'physicalAddresses',
      display: 'List of all physical addresses',
      name: 'Physical Address',
      fields: [
        {
          key: 'description',
          display: 'Description of physical address',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'street',
          display: 'Street',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'city',
          display: 'city',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'subdivision',
          display: 'Subdivision - state/province/emirate/oblast/etc',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'postalCode',
          display: 'Postal Code',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'country',
          display: 'Country',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [],
    },
    {
      key: 'principals',
      display: 'List of owners (principals)',
      name: 'Owner (Principal)',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'name',
          display: 'Name of owner (principal)',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'passportNumber',
          display: 'Passport number of owner (principal)',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'shares',
          display: 'Number of shares of owner (principal)',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'signingAbilityConditions',
          display: 'Conditions or notes',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [
        [{
          key: 'walletAddress',
          display: 'Liberland wallet address',
          isEncrypted: false,
        },
        {
          key: 'name',
          display: 'Name of principal',
          isEncrypted: false,
        },
        {
          key: 'passportNumber',
          display: 'Passport number of principal',
          isEncrypted: false,
        },
        {
          key: 'shares',
          display: 'Number of shares of principal',
          isEncrypted: false,
        },
        {
          key: 'signingAbilityConditions',
          display: 'Conditions or notes',
          isEncrypted: false,
        }],
      ],
    },
    {
      key: 'shareholders',
      display: 'List of all shareholders',
      name: 'Shareholder',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'name',
          display: 'Name of shareholder',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'passportNumber',
          display: 'Passport number of shareholder',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'shares',
          display: 'Number of shares of shareholder',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [],
    },
    {
      key: 'UBOs',
      display: 'List of all Ultimate Beneficiaries',
      name: 'Ultimate Beneficiary',
      fields: [
        {
          key: 'walletAddress',
          display: 'Liberland wallet address',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'name',
          display: 'Name of UBO',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'passportNumber',
          display: 'Passport number of UBO',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'signingAbility',
          display: 'Can be full or other',
          type: 'text',
          encryptable: true,
        },
        {
          key: 'signingAbilityConditions',
          display: 'Any conditions on UBO signing ability. Must be in agreement',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [],
    },
    {
      key: 'relevantContracts',
      display: 'List of relevant on-chain contract ids',
      name: 'Relevant on-chain Contracts',
      fields: [
        {
          key: 'contractId',
          display: 'Contract id or link',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [],
    },
    {
      key: 'relevantAssets',
      display: 'List of relevant on-chain asset ids)',
      name: 'Relevant on-chain Assets',
      fields: [
        {
          key: 'assetId',
          display: 'Asset id',
          type: 'text',
          encryptable: true,
        },
      ],
      data: [],
    },
  ],
};

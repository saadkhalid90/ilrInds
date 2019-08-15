// title of each indicator
let indTitles = [
  'Minimum Wage Provision',
  'Wage Payment at the end of wage period (Days)',
  'General Working Hours',
  'Maximum working hours (including overtime)',
  'Overtime Compensation Rates',
  'Night Work Compensation (Type)',
  'Premium for Night Work',
  'Paid Annual Leave',
  'Public Holidays (Number of Days)',
  'Weekly Rest Time (hours)',
  'Employment Contracts (format)',
  'Length of Single Fixed Term Contract (Months)',
  'Probation Period',
  'Contract Termination Notice Period',
  'Severance Pay (after five years of service)',
  'Paternity Leave',
  'Parental Leave (Duration)',
  'Maternity Leave',
  'Maternity Leave (Duration): ILO Conventions',
  'Maternity Leave Payment',
  'Nursing Breaks - Duration, (hours)',
  'Nursing Breaks - Length (Months)/Age of Child',
  'Unemployment Benefits',
  'Equal Pay for Equal Work',
  'Sexual Harassment',
  'Forced Labour Prohibition (Source)',
  'Compulsory Schooling Age',
  'Child Work - Age for Entry into Full Time Employment',
  'Child Work - Age for Hazardous Work',
  'Work Prohibited for Children under 18 years (Type)',
  'Freedom to Join and Form a Union',
  'Freedom of Collective Bargaining',
  'Right to Strike'
];


// possible categories/ outcomes for each indicator
let indOptionKey = [
  {
    A : 'Set by Law',
    B : 'set by Collective Bargaining',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '1-5 days',
    B : '6-10 days',
    C : 'More than 10 days',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '< 40 hours',
    B : '40-44 hours',
    C : '45-48 hours',
    D : '>48 hours',
    Z : 'Insufficient Data'
  },
  {
    A : 'less than or equal to 48 hours',
    B : '49-56 hours;C:57-60 hours',
    D : '61 or more hours',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '151-200%',
    B : '126-150%',
    C : '100-125%',
    D :'fixed by Collective Bargaining',
    E : 'No Premium for Overtime Work',
    Z :'Insufficient Data (Beyond 48 hours rates to be taken)'
  },
  {
    A : 'Monetary Compensation',
    B : 'Reduction in working hours',
    C : 'Both (Monetary Compensation and hours reduction)',
    D : 'Set by Collective Bargaining',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '121-150%',
    B : '111-120%',
    C : '100-110%',
    D : 'fixed by Collective Bargaining',
    E : 'No Premium for Night Work',
    Z : 'Insufficient Data'
  },
  {
    A : 'More than 3 Working Weeks',
    B : '3 Working Weeks',
    C : 'Less than 3 working weeks',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : '7-10 days',
    B : '11-13 days',
    C : '14-15 days',
    D : '16-18 days',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '37-48 hours',
    B : '25-36 hours',
    C : '24 hours',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Written Contract',
    B : 'Oral Contract',
    C : 'Both (written & oral contracts) allowed',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '1-12 months',
    B : '13-24 months',
    C : '25-36 months',
    D : '37 months or more',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Less than 3 months',
    B : '3-5.9 months',
    C : '6 months',
    D : 'More than 6 months',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : '> 4 weeks',
    B : '3-4 weeks',
    C : '1-2.9 weeks',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : '1-30 days',
    B : '31-60 days',
    C : '61-90 days',
    D : '91 days or more',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '14 weeks or more',
    B : '4-13 weeks',
    C : '1-3 weeks',
    D : 'Less than One Week',
    E : 'No provision for Paternity Leave',
    Z : 'Insufficient Data'
  },
  {
    A : '1-90 days (3 months)',
    B : '91-180 days (6 months)',
    C : '181-365 days (6-12 months)',
    D : '366 days and more',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '52 weeks or more',
    B : '26-51 weeks',
    C : '14-25 weeks',
    D : '1-13 weeks',
    E : 'No provision for Paid Maternity Leave',
    Z : 'Insufficient Data'
  },
  {
    A : 'less than 12 weeks',
    B : '12-13 weeks (Conventions 3 & 103)',
    C : '14 weeks (Convention 183)',
    D : '15-18 weeks or more (Recommendation 191)',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Paid by the Government',
    B : 'Paid by the Government and Employer',
    C : 'Paid by the Employer',
    E : 'No Provision for Paid Leave',
    Z : 'Insufficient Data'
  },
  {
    A : 'More than 1 hour',
    B : 'One Hour',
    C : 'Less than One Hour',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'More than 12 months',
    B : '12 months',
    C : '6-11.9 months',
    D : '1-5.9 months',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Government Unemployment Benefits for all',
    B : 'Government Unemployment Benefits (self employed excluded)',
    C : 'Severance Pay Only',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Guaranteed Under Consititution and Labour Code',
    B : 'Provided under either Constitution, Labour Code or special law',
    E : 'No Provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Prohibited under law with civil remedies',
    B : 'Prohibited under law with criminal penalties',
    C : 'Prohibited under law with both civil remedy and criminal penalties',
    D : 'General prohibition only',
    E : 'No Prohibition',
    Z : 'Insufficient Data'
  },
  {
    A : 'Constitution',
    B : 'Labour Code',
    C : 'Criminal Code/Anti-Trafficking Law',
    D : 'Provided under any of the above two laws',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '10 years',
    B : '11-13 years',
    C : '14-16 years',
    D : '17-18 years',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : '16-18 years',
    B : '15 years',
    C : '14 years',
    D : '12-13 years',
    E : 'No minimum age',
    Z : 'Insufficient Data'
  },
  {
    A : '18 years',
    B : '16-17 years',
    C : '15 years',
    D : '14 years',
    E : 'No minimum age for hazardous work',
    Z : 'Insufficient Data'
  },
  {
    A : 'Overtime Work',
    B : 'Night Work',
    C : 'Both prohibited',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Constitution',
    B : 'Labour Code',
    C : 'Trade Union Law',
    D : 'Both (provided under any of the above two laws)',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Constitution',
    B : 'Labour Code',
    C : 'Trade Union Law/Collective Bargaining Law',
    D : 'Both (provided under any of the above two laws)',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  },
  {
    A : 'Constitution',
    B : 'Labour Code',
    C : 'Trade Union Law/Industrial Disputes Act',
    D : 'Both (provided under any of the above two laws)',
    E : 'No clear provision',
    Z : 'Insufficient Data'
  }
]

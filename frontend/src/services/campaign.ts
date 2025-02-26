export interface CampaignDTO {
  id: number;
  title: string;
  brandName: string;
  image: string;
  applicationStart: string;
  applicationEnd: string;
  selectionStart: string;
  selectionEnd: string;
  announcement: string;
  resultAnnouncement: string;
  people: number;
  videoMin: number;
  videoMax: number;
  sns: string[];
  missionText: string;
  productDetail: string;
  rewardCredit: string;
  rewardAdditional: string;
  notes: string;
  location: string;
  reserveTime: string;
  visitTime: string;
  status: string;
  createdAt: string;
}

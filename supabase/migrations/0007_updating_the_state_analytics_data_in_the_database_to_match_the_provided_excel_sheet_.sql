-- Correcting data for Madhya Pradesh
UPDATE public.state_fra_analytics
SET
  claims_received_individual = 375513,
  claims_received_community = 27812,
  titles_distributed_individual = 261199,
  titles_distributed_community = 15803,
  extent_of_land_acres = 1884170.93,
  frcs_constituted = 22819,
  sdlc_constituted = 313,
  dlc_constituted = 48,
  claims_rejected_individual = 114314,
  claims_rejected_community = 12009,
  extent_of_land_individual_acres = 569841.11,
  extent_of_land_community_acres = 1314329.82
WHERE state_name = 'Madhya Pradesh';

-- Correcting data for Odisha
UPDATE public.state_fra_analytics
SET
  claims_received_individual = 599439,
  claims_received_community = 11179,
  titles_distributed_individual = 457199,
  titles_distributed_community = 7163,
  extent_of_land_acres = 1018580.00,
  frcs_constituted = 35000,
  sdlc_constituted = 118,
  dlc_constituted = 30,
  claims_rejected_individual = 142240,
  claims_rejected_community = 4016,
  extent_of_land_individual_acres = 699743.00,
  extent_of_land_community_acres = 318837.00
WHERE state_name = 'Odisha';

-- Correcting data for Tripura
UPDATE public.state_fra_analytics
SET
  claims_received_individual = 201111,
  claims_received_community = 3111,
  titles_distributed_individual = 131521,
  titles_distributed_community = 1111,
  extent_of_land_acres = 461434.5,
  frcs_constituted = 4111,
  sdlc_constituted = 23,
  dlc_constituted = 8,
  claims_rejected_individual = 69590,
  claims_rejected_community = 2000,
  extent_of_land_individual_acres = 460323.5,
  extent_of_land_community_acres = 1111.0
WHERE state_name = 'Tripura';

-- Correcting data for Telangana
UPDATE public.state_fra_analytics
SET
  claims_received_individual = 186949,
  claims_received_community = 1849,
  titles_distributed_individual = 96677,
  titles_distributed_community = 1849,
  extent_of_land_acres = 700000.0,
  frcs_constituted = 3143,
  sdlc_constituted = 33,
  dlc_constituted = 10,
  claims_rejected_individual = 90272,
  claims_rejected_community = 0,
  extent_of_land_individual_acres = 300000.0,
  extent_of_land_community_acres = 400000.0
WHERE state_name = 'Telangana';
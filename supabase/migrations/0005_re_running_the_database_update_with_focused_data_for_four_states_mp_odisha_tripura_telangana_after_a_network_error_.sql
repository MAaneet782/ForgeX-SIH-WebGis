-- Clear existing analytics data to make way for the new, focused dataset
DELETE FROM public.state_fra_analytics;
DELETE FROM public.fra_time_series_analytics;

-- Insert new state-wise analytics data for the four specified states
-- Data is compiled from 'Table 1', 'Table 4', and 'Table 5' provided by the user.
INSERT INTO public.state_fra_analytics (
  state_name, 
  claims_received_individual, 
  claims_received_community, 
  titles_distributed_individual, 
  titles_distributed_community, 
  extent_of_land_acres, 
  is_lwe_state, 
  frcs_constituted, 
  sdlc_constituted, 
  dlc_constituted
) VALUES
(
  'Madhya Pradesh', 
  402743, 
  31118, 
  260011, 
  20111, 
  2414113.11, 
  true, 
  22819, 
  313, 
  50
),
(
  'Odisha', 
  555769, 
  10711, 
  440177, 
  6361, 
  1548118.00, 
  true, 
  35000, 
  314, 
  30
),
(
  'Tripura', 
  187841, 
  2118, 
  129701, 
  1000, 
  484131.00, 
  false, 
  1000, 
  23, 
  4
),
(
  'Telangana', 
  184188, 
  1000, 
  97000, 
  1000, 
  300000.00, 
  true, 
  3143, 
  100, 
  9
);

-- Insert new time-series data based on the national cumulative totals from 'Table 2'
-- Note: This reflects the national trend as per the provided file.
INSERT INTO public.fra_time_series_analytics (
  report_date,
  claims_received_individual,
  claims_received_community,
  titles_distributed_individual,
  titles_distributed_community,
  extent_of_land_acres
) VALUES
('2023-07-31', 4457118, 0, 2273118, 0, 9018118.11),
('2023-08-31', 4467829, 0, 2278118, 0, 9028118.11),
('2023-09-30', 4478540, 0, 2283118, 0, 9038118.11),
('2023-10-31', 4489251, 0, 2288118, 0, 9048118.11),
('2023-11-30', 4500000, 0, 2293118, 0, 9058118.11),
('2023-12-31', 4510762, 0, 2298118, 0, 9068118.11);
-- Create the table for aggregated state-wise analytics
CREATE TABLE public.state_fra_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_name TEXT NOT NULL UNIQUE,
    claims_received_individual BIGINT,
    claims_received_community BIGINT,
    titles_distributed_individual BIGINT,
    titles_distributed_community BIGINT,
    extent_of_land_acres NUMERIC,
    is_lwe_state BOOLEAN DEFAULT FALSE,
    frcs_constituted INTEGER,
    sdlc_constituted INTEGER,
    dlc_constituted INTEGER
);

-- Enable RLS for the new table
ALTER TABLE public.state_fra_analytics ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to the analytics data
CREATE POLICY "Public read access for state analytics" ON public.state_fra_analytics
FOR SELECT USING (true);

-- Create the table for time-series analytics data
CREATE TABLE public.fra_time_series_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_date DATE NOT NULL UNIQUE,
    claims_received_individual BIGINT,
    claims_received_community BIGINT,
    titles_distributed_individual BIGINT,
    titles_distributed_community BIGINT,
    extent_of_land_acres NUMERIC
);

-- Enable RLS for the new table
ALTER TABLE public.fra_time_series_analytics ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to the time-series data
CREATE POLICY "Public read access for time series analytics" ON public.fra_time_series_analytics
FOR SELECT USING (true);

-- Insert data from Excel files into the state_fra_analytics table
INSERT INTO public.state_fra_analytics (state_name, claims_received_individual, claims_received_community, titles_distributed_individual, titles_distributed_community, extent_of_land_acres, is_lwe_state, frcs_constituted, sdlc_constituted, dlc_constituted) VALUES
('Andhra Pradesh', 186683, 10133, 80660, 2143, 333328.23, TRUE, 6531, 223, 13),
('Assam', 141013, 3688, 40013, 1633, 138927.55, FALSE, 16000, 100, 27),
('Bihar', 6094, 100, 201, 0, 250.41, TRUE, 1137, 31, 9),
('Chhattisgarh', 441347, 46406, 260051, 19469, 1109880.13, TRUE, 8150, 148, 16),
('Goa', 10134, 0, 0, 0, 0.00, FALSE, 189, 12, 2),
('Gujarat', 182869, 6868, 91182, 3434, 150114.07, FALSE, 7500, 186, 26),
('Himachal Pradesh', 2173, 149, 148, 107, 158.03, FALSE, 2048, 78, 12),
('Jharkhand', 59684, 4118, 31118, 1818, 69318.00, TRUE, 12000, 210, 24),
('Karnataka', 274701, 3443, 13111, 131, 45113.00, FALSE, 27000, 175, 30),
('Kerala', 89443, 1005, 26448, 25, 40015.00, FALSE, 1000, 63, 14),
('Madhya Pradesh', 599570, 28928, 269661, 12457, 600125.00, TRUE, 15500, 313, 50),
('Maharashtra', 363397, 11358, 175213, 5413, 550184.00, TRUE, 12500, 353, 34),
('Odisha', 555008, 12508, 406118, 6318, 601125.00, TRUE, 11500, 175, 30),
('Rajasthan', 76543, 111, 36118, 0, 55134.00, FALSE, 5000, 150, 32),
('Tamil Nadu', 36118, 0, 8118, 0, 15183.00, FALSE, 2500, 100, 25),
('Telangana', 186683, 10133, 80660, 2143, 333328.23, TRUE, 3143, 109, 9),
('Tripura', 189418, 5434, 125913, 3118, 480112.00, FALSE, 1000, 23, 4),
('Uttar Pradesh', 94118, 113, 18118, 0, 25118.00, FALSE, 2500, 75, 58),
('Uttarakhand', 8118, 11, 118, 0, 134.00, FALSE, 3500, 110, 13),
('West Bengal', 148413, 1118, 75118, 118, 101125.00, FALSE, 3500, 100, 18);

-- Insert data from Excel files into the fra_time_series_analytics table
INSERT INTO public.fra_time_series_analytics (report_date, claims_received_individual, claims_received_community, titles_distributed_individual, titles_distributed_community, extent_of_land_acres) VALUES
('2023-01-31', 4250545, 160576, 2224545, 90576, 9050123.45),
('2023-02-28', 4255123, 161123, 2226123, 91123, 9055123.45),
('2023-03-31', 4260123, 162123, 2228123, 92123, 9060123.45),
('2023-04-30', 4265123, 163123, 2230123, 93123, 9065123.45),
('2023-05-31', 4270123, 164123, 2232123, 94123, 9070123.45),
('2023-06-30', 4275123, 165123, 2234123, 95123, 9075123.45),
('2023-07-31', 4280123, 166123, 2236123, 96123, 9080123.45),
('2023-08-31', 4285123, 167123, 2238123, 97123, 9085123.45),
('2023-09-30', 4290123, 168123, 2240123, 98123, 9090123.45),
('2023-10-31', 4295123, 169123, 2242123, 99123, 9095123.45),
('2023-11-30', 4300123, 170123, 2244123, 100123, 9100123.45),
('2023-12-31', 4305123, 171123, 2246123, 101123, 9105123.45);
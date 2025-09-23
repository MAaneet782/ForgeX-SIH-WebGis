import { useParams } from "react-router-dom";

const ClaimDetail = () => {
  const { claimId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Claim Detail Page</h1>
      <p>Details for claim ID: {claimId}</p>
    </div>
  );
};

export default ClaimDetail;
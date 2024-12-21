import React, { useEffect, useState } from "react";
import { getFreelancerBids } from "../../services/bidService";
import BidCard from "../../components/freelancer/BidCard";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";

function FreelancerBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      try {
        const response = await getFreelancerBids();
        if (response.success && response.data) {
          setBids(response.data.bids || []); // Extract 'bids' from the response
          console.log("Bids loaded successfully!");
        } else {
          setBids([]);
          setAlert({ isOpen: true, type: "error", message: response.message || "Failed to load bids." });
        }
      } catch (error) {
        setAlert({ isOpen: true, type: "error", message: "Failed to load bids." });
      } finally {
        setLoading(false);
      }
    };
  
    fetchBids();
  }, []);
  
  useEffect(() => {
    if (alert.isOpen) {
      const timeout = setTimeout(() => {
        setAlert({ ...alert, isOpen: false });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);
  
  
  const handleCloseAlert = () => setAlert({ ...alert, isOpen: false });

  return (
    <div>
      {loading && <Loading />}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={handleCloseAlert}
      />
      <h1 className="text-3xl font-bold mb-8">My Bids</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(bids) && bids.length > 0 ? (
          bids.map((bid, index) => <BidCard key={index} {...bid} />)
        ) : (
          <p>No bids available.</p>
        )}
      </div>
    </div>
  );
}

export default FreelancerBids;
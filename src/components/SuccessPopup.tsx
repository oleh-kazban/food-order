import { useUserProgress } from '@order/state/userProgress.context';
import { Modal } from '@order/ui/Modal';

export function SuccessPopup() {
  const { state, clearProgress } = useUserProgress();

  return (
    <Modal open={state === 'success'} onClose={clearProgress}>
      <h2>Success!</h2>
      <p>Your order was submitted successfully</p>
      <p>We will get back to you with more details via email within the next few minutes</p>
      <p className="modal-actions">
        <button type="button" className="button" onClick={clearProgress}>
          Okay
        </button>
      </p>
    </Modal>
  );
}
